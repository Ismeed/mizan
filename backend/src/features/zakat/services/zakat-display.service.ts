/**
 * MIZAN — Zakat Category Display Service (Phase 8)
 *
 * Builds the ordered, localized list of Zakat category input sections
 * for the mobile and web Zakat input UI.
 *
 * Uses canonical IDs as keys — never translated labels as identifiers.
 */

import {
  BASELINE_CANONICAL_ZAKAT_GROUPS,
  getZakatCategoryById,
} from '@mizan/shared';
import type {
  CanonicalZakatCategoryId,
  SupportedZakatLanguage,
  ZakatCategoryLabelSet,
} from '@mizan/shared';
import { ZakatLocalizationService } from './zakat-localization.service';
import { ZakatCategoryAvailabilityService } from './zakat-category-availability.service';

const localizationSvc = new ZakatLocalizationService();
const availabilitySvc = new ZakatCategoryAvailabilityService();

/** A single category display item for the Zakat input UI */
export interface ZakatCategoryDisplayItem {
  categoryId: CanonicalZakatCategoryId;
  labelSet: ZakatCategoryLabelSet;
  isAvailable: boolean;
  isLiability: boolean;
  requiresReview: boolean;
  valueType: string;
  requiresIrrigationMethod: boolean;
  allowsItemBreakdown: boolean;
  displayOrder: number;
  groupId: string;
}

/** A section of the Zakat input form */
export interface ZakatInputSection {
  groupId: string;
  groupLabel: string;
  displayOrder: number;
  isCollapsible: boolean;
  categories: ZakatCategoryDisplayItem[];
}

export class ZakatDisplayService {

  /**
   * Build the complete, ordered, localized Zakat input form sections
   * for the given madhhab and language.
   *
   * Returns sections ordered by displayOrder, each containing
   * an ordered list of available categories.
   */
  buildZakatInputSections(
    madhhab: string,
    language: SupportedZakatLanguage = 'en',
    options?: {
      /** Whether to include categories requiring review */
      includeReviewRequired?: boolean;
      /** Whether to include liability categories */
      includeLiabilities?: boolean;
      /** Whether to include ALL_ZAKATABLE_ASSETS and ALL_DEDUCTIBLE_LIABILITIES meta-groups */
      includeMetaGroups?: boolean;
    },
  ): ZakatInputSection[] {
    const {
      includeReviewRequired = true,
      includeLiabilities = true,
      includeMetaGroups = false,
    } = options ?? {};

    const META_GROUPS = new Set(['ALL_ZAKATABLE_ASSETS', 'ALL_DEDUCTIBLE_LIABILITIES']);

    const sections: ZakatInputSection[] = [];

    for (const group of BASELINE_CANONICAL_ZAKAT_GROUPS.sort((a, b) => a.displayOrder - b.displayOrder)) {
      // Skip meta-groups unless requested
      if (!includeMetaGroups && META_GROUPS.has(group.groupId)) continue;
      // Skip liability group if not requested
      if (!includeLiabilities && group.groupId === 'LIABILITIES') continue;

      const categoryItems: ZakatCategoryDisplayItem[] = [];

      for (const member of group.members.sort((a, b) => a.displayOrder - b.displayOrder)) {
        const categoryId = member.categoryId as CanonicalZakatCategoryId;
        const entity = getZakatCategoryById(categoryId);
        if (!entity) continue;

        const availability = availabilitySvc.getAvailability({ categoryId, madhhab });

        // Skip NOT_SUPPORTED and NOT_YET_MODELLED
        if (availability.supportStatus === 'NOT_SUPPORTED') continue;
        if (availability.supportStatus === 'NOT_YET_MODELLED') continue;

        // Skip REVIEW_REQUIRED if not requested
        if (!includeReviewRequired && availability.requiresReview) continue;

        const labelSet = localizationSvc.getLocalizedLabelSet(categoryId, language);

        categoryItems.push({
          categoryId,
          labelSet,
          isAvailable: availability.isAvailableForInput,
          isLiability: entity.classification.isLiability,
          requiresReview: availability.requiresReview,
          valueType: entity.inputMetadata.valueType,
          requiresIrrigationMethod: entity.inputMetadata.requiresIrrigationMethod ?? false,
          allowsItemBreakdown: entity.inputMetadata.allowsItemBreakdown,
          displayOrder: member.displayOrder,
          groupId: group.groupId,
        });
      }

      if (categoryItems.length > 0) {
        sections.push({
          groupId: group.groupId,
          groupLabel: group.canonicalName, // Will be resolved via i18n in production
          displayOrder: group.displayOrder,
          isCollapsible: group.isCollapsible,
          categories: categoryItems,
        });
      }
    }

    return sections;
  }

  /**
   * Get the flat list of available category IDs for a given madhhab,
   * ordered by group display order and then category display order.
   */
  getOrderedCategoryIds(madhhab: string): CanonicalZakatCategoryId[] {
    return this.buildZakatInputSections(madhhab)
      .flatMap(s => s.categories.map(c => c.categoryId));
  }
}
