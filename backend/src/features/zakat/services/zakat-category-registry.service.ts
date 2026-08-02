/**
 * MIZAN — Zakat Category Registry Service (Phase 8)
 *
 * Loads canonical Zakat category entity records from the in-code baseline registry.
 * In future releases this will also query the database for DB-managed records.
 *
 * CRITICAL: This service returns entity metadata ONLY.
 * Eligibility, nisab, rates, and aggregation are determined by the Rule Engine.
 */

import {
  BASELINE_CANONICAL_ZAKAT_CATEGORIES,
  CANONICAL_ZAKAT_CATEGORY_INDEX,
  getZakatCategoryById,
} from '@mizan/shared';
import type {
  CanonicalZakatCategoryId,
  ZakatCategoryEntityRecord,
  ZakatCategoryInputSupportStatus,
} from '@mizan/shared';

export class ZakatCategoryRegistryService {

  /**
   * Load a canonical Zakat category entity by its permanent ID.
   * Throws if the category is not found.
   */
  loadCategoryById(
    categoryId: CanonicalZakatCategoryId,
  ): ZakatCategoryEntityRecord {
    const entity = getZakatCategoryById(categoryId);
    if (!entity) {
      throw new Error(`ZakatCategoryRegistryService: Unknown canonical category ID: "${categoryId}"`);
    }
    return entity;
  }

  /**
   * Load a canonical Zakat category entity by its permanent ID.
   * Returns undefined if not found (non-throwing variant).
   */
  findCategoryById(
    categoryId: CanonicalZakatCategoryId,
  ): ZakatCategoryEntityRecord | undefined {
    return getZakatCategoryById(categoryId);
  }

  /**
   * List all canonical category entities.
   * Optionally filter by madhhab support status and/or whether
   * this is a liability category.
   */
  listCategories(options?: {
    madhhab?: string;
    supportStatus?: ZakatCategoryInputSupportStatus;
    excludeLiabilities?: boolean;
    excludeNotYetModelled?: boolean;
  }): ZakatCategoryEntityRecord[] {
    let results = [...BASELINE_CANONICAL_ZAKAT_CATEGORIES];

    if (options?.excludeLiabilities) {
      results = results.filter(c => !c.classification.isLiability);
    }

    if (options?.madhhab) {
      const mKey = options.madhhab as keyof ZakatCategoryEntityRecord['madhhabMetadata'];
      if (options?.supportStatus) {
        results = results.filter(c => {
          const entry = c.madhhabMetadata[mKey];
          return entry?.inputSupportStatus === options.supportStatus;
        });
      } else if (options?.excludeNotYetModelled) {
        results = results.filter(c => {
          const entry = c.madhhabMetadata[mKey];
          return entry?.inputSupportStatus !== 'NOT_YET_MODELLED'
            && entry?.inputSupportStatus !== 'NOT_SUPPORTED';
        });
      }
    }

    return results;
  }

  /**
   * List the canonical IDs of all supported input categories for a given madhhab.
   * Excludes NOT_SUPPORTED and NOT_YET_MODELLED categories.
   * Liabilities are included unless excludeLiabilities is set.
   */
  getSupportedCategoryIds(
    madhhab: string,
    options?: { excludeLiabilities?: boolean }
  ): CanonicalZakatCategoryId[] {
    return this.listCategories({
      madhhab,
      excludeNotYetModelled: true,
      excludeLiabilities: options?.excludeLiabilities,
    }).map(c => c.categoryId);
  }

  /**
   * Check whether a canonical category ID exists in the registry.
   */
  isKnownCategoryId(id: string): id is CanonicalZakatCategoryId {
    return CANONICAL_ZAKAT_CATEGORY_INDEX.has(id as CanonicalZakatCategoryId);
  }

  /**
   * Check whether a category is a user-input category (vs. computed or derived).
   */
  isUserInputCategory(categoryId: CanonicalZakatCategoryId): boolean {
    return getZakatCategoryById(categoryId)?.inputMetadata.isUserInput ?? false;
  }

  /**
   * Check whether a category is a liability category.
   */
  isLiabilityCategory(categoryId: CanonicalZakatCategoryId): boolean {
    return getZakatCategoryById(categoryId)?.classification.isLiability ?? false;
  }
}
