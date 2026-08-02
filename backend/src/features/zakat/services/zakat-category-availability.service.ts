/**
 * MIZAN — Zakat Category Availability Service (Phase 8)
 *
 * Checks whether a canonical Zakat category is available as a user input
 * for a given madhhab and knowledge release version.
 *
 * CRITICAL:
 * - Input AVAILABILITY does NOT equal zakatable status.
 * - Whether a category is zakatable is determined by the Rule Engine.
 * - This service only checks whether the category is supported as an INPUT.
 */

import type {
  CanonicalZakatCategoryId,
  ZakatCategoryInputSupportStatus,
} from '@mizan/shared';
import { getZakatCategoryById } from '@mizan/shared';

export interface ZakatCategoryAvailabilityRequest {
  categoryId: CanonicalZakatCategoryId;
  madhhab: string;
  knowledgeReleaseVersion?: string;
}

export interface ZakatCategoryAvailabilityResult {
  categoryId: CanonicalZakatCategoryId;
  madhhab: string;
  supportStatus: ZakatCategoryInputSupportStatus;
  isAvailableForInput: boolean;
  requiresReview: boolean;
  scholarNotes?: string;
}

export class ZakatCategoryAvailabilityService {

  /**
   * Get the availability and input support status of a Zakat category
   * for a specific madhhab.
   */
  getAvailability(
    request: ZakatCategoryAvailabilityRequest,
  ): ZakatCategoryAvailabilityResult {
    const { categoryId, madhhab } = request;

    const entity = getZakatCategoryById(categoryId);
    if (!entity) {
      return {
        categoryId,
        madhhab,
        supportStatus: 'NOT_SUPPORTED',
        isAvailableForInput: false,
        requiresReview: false,
      };
    }

    const mKey = madhhab as keyof typeof entity.madhhabMetadata;
    const madhhabEntry = entity.madhhabMetadata[mKey];

    if (!madhhabEntry) {
      // Unknown madhhab — treat as SUPPORTED (don't restrict unknown madhhabs)
      return {
        categoryId,
        madhhab,
        supportStatus: 'SUPPORTED',
        isAvailableForInput: true,
        requiresReview: false,
      };
    }

    const status = madhhabEntry.inputSupportStatus;
    const isAvailableForInput = status === 'SUPPORTED' || status === 'REVIEW_REQUIRED';
    const requiresReview = status === 'REVIEW_REQUIRED';

    return {
      categoryId,
      madhhab,
      supportStatus: status,
      isAvailableForInput,
      requiresReview,
      scholarNotes: madhhabEntry.scholarNotes,
    };
  }

  /**
   * Batch-check availability for multiple categories.
   */
  getAvailabilityBatch(
    categoryIds: CanonicalZakatCategoryId[],
    madhhab: string,
    knowledgeReleaseVersion?: string,
  ): ZakatCategoryAvailabilityResult[] {
    return categoryIds.map(categoryId =>
      this.getAvailability({ categoryId, madhhab, knowledgeReleaseVersion })
    );
  }

  /**
   * Filter a list of category IDs to those available for input in a given madhhab.
   */
  filterAvailableCategories(
    categoryIds: CanonicalZakatCategoryId[],
    madhhab: string,
  ): CanonicalZakatCategoryId[] {
    return categoryIds.filter(id => {
      const result = this.getAvailability({ categoryId: id, madhhab });
      return result.isAvailableForInput;
    });
  }
}
