/**
 * MIZAN — Canonical Zakat Category ID Tests (Phase 8)
 *
 * Validates the format and constraints of all permanent Zakat category IDs.
 */

import { CanonicalZakatCategoryIdSchema } from '@mizan/shared';
import {
  BASELINE_CANONICAL_ZAKAT_CATEGORIES,
  listZakatCategoryIds,
  getZakatCategoryById,
} from '@mizan/shared';

describe('Canonical Zakat Category ID — Format Validation', () => {
  const VALID_IDS = [
    'CASH_AND_BANK',
    'GOLD',
    'SILVER',
    'BUSINESS_INVENTORY',
    'AGRICULTURAL_PRODUCE',
    'LIVESTOCK_CAMELS',
    'LIVESTOCK_CATTLE',
    'LIVESTOCK_SHEEP_GOATS',
    'CURRENT_LIABILITIES',
    'DIGITAL_CURRENCY',
  ];

  const INVALID_IDS = [
    'cash_and_bank',         // lowercase
    'Cash And Bank',         // mixed case with spaces
    '_GOLD',                 // starts with underscore
    'GOLD_',                 // ends with underscore
    'GOLD__SILVER',          // double underscore
    'HANAFI_GOLD',           // contains madhhab name
    'MALIKI_CATEGORY',       // contains madhhab name
    '',                      // empty
    'A',                     // too short (single character edge)
    'gold',                  // all lowercase
  ];

  test.each(VALID_IDS)('Valid ID accepted: %s', (id) => {
    const result = CanonicalZakatCategoryIdSchema.safeParse(id);
    expect(result.success).toBe(true);
  });

  test.each(INVALID_IDS)('Invalid ID rejected: %s', (id) => {
    const result = CanonicalZakatCategoryIdSchema.safeParse(id);
    expect(result.success).toBe(false);
  });
});

describe('Baseline Canonical Zakat Category Registry', () => {
  test('Registry contains baseline categories', () => {
    expect(BASELINE_CANONICAL_ZAKAT_CATEGORIES.length).toBe(26);
  });

  test('All category IDs pass the CanonicalZakatCategoryIdSchema', () => {
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      const result = CanonicalZakatCategoryIdSchema.safeParse(category.categoryId);
      expect(result.success).toBe(true);
    }
  });

  test('All category IDs are unique', () => {
    const ids = listZakatCategoryIds();
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('No category ID contains a madhhab name', () => {
    const MADHHAB_NAMES = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'];
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      for (const madhhab of MADHHAB_NAMES) {
        expect(category.categoryId).not.toContain(madhhab);
      }
    }
  });

  test('All categories have all five madhhab metadata entries', () => {
    const MADHHABS = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'];
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      for (const madhhab of MADHHABS) {
        expect(category.madhhabMetadata[madhhab as keyof typeof category.madhhabMetadata]).toBeDefined();
      }
    }
  });

  test('All categories have a governance status of DRAFT in the baseline', () => {
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      expect(category.governance.status).toBe('DRAFT');
    }
  });

  test('Liability categories are correctly marked', () => {
    const LIABILITY_IDS = ['CURRENT_LIABILITIES', 'DEFERRED_LIABILITIES'];
    for (const id of LIABILITY_IDS) {
      const cat = getZakatCategoryById(id as any);
      expect(cat?.classification.isLiability).toBe(true);
    }
  });

  test('Non-liability categories are not marked as liabilities', () => {
    const ASSET_IDS = ['GOLD', 'SILVER', 'CASH_AND_BANK', 'BUSINESS_INVENTORY'];
    for (const id of ASSET_IDS) {
      const cat = getZakatCategoryById(id as any);
      expect(cat?.classification.isLiability).toBe(false);
    }
  });

  test('AGRICULTURAL_PRODUCE requires irrigation method', () => {
    const cat = getZakatCategoryById('AGRICULTURAL_PRODUCE');
    expect(cat?.inputMetadata.requiresIrrigationMethod).toBe(true);
  });

  test('All categories have valid localization keys', () => {
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      expect(category.localization.labelKey).toContain(category.categoryId);
      expect(category.localization.descriptionKey).toContain(category.categoryId);
      expect(category.localization.reportLabelKey).toContain(category.categoryId);
    }
  });

  test('getZakatCategoryById returns correct entity', () => {
    const gold = getZakatCategoryById('GOLD');
    expect(gold).toBeDefined();
    expect(gold?.categoryId).toBe('GOLD');
    expect(gold?.classification.domain).toBe('PRECIOUS_METALS');
  });

  test('getZakatCategoryById returns undefined for unknown ID', () => {
    const result = getZakatCategoryById('UNKNOWN_CATEGORY' as any);
    expect(result).toBeUndefined();
  });
});
