/**
 * MIZAN — Zakat Category Availability Tests (Phase 8)
 *
 * Tests the ZakatCategoryAvailabilityService — input availability
 * and madhhab support status resolution.
 *
 * CRITICAL: These tests verify AVAILABILITY only (not zakatable status).
 */

import {
  BASELINE_CANONICAL_ZAKAT_CATEGORIES,
} from '@mizan/shared';

// ── Availability Logic Tests (pure / without backend service dep) ───────────────

describe('Zakat Category Availability — Madhhab Support', () => {
  test('DIGITAL_CURRENCY is REVIEW_REQUIRED in all madhhabs', () => {
    const digitalCurrency = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'DIGITAL_CURRENCY');
    expect(digitalCurrency).toBeDefined();
    const statuses = Object.values(digitalCurrency!.madhhabMetadata).map(e => (e as any).inputSupportStatus);
    expect(statuses.every(s => s === 'REVIEW_REQUIRED')).toBe(true);
  });

  test('GOLD is SUPPORTED in all five madhhabs', () => {
    const gold = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'GOLD');
    expect(gold).toBeDefined();
    const statuses = Object.values(gold!.madhhabMetadata).map(e => (e as any).inputSupportStatus);
    expect(statuses.every(s => s === 'SUPPORTED')).toBe(true);
  });

  test('CASH_AND_BANK is SUPPORTED in all five madhhabs', () => {
    const cash = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'CASH_AND_BANK');
    expect(cash).toBeDefined();
    const statuses = Object.values(cash!.madhhabMetadata).map(e => (e as any).inputSupportStatus);
    expect(statuses.every(s => s === 'SUPPORTED')).toBe(true);
  });

  test('No category with domain LIABILITIES has hawlRequirement REQUIRED', () => {
    const liabilityCategories = BASELINE_CANONICAL_ZAKAT_CATEGORIES.filter(c => c.classification.domain === 'LIABILITIES');
    for (const cat of liabilityCategories) {
      expect(cat.classification.hawlRequirement).not.toBe('REQUIRED');
    }
  });

  test('AGRICULTURAL_PRODUCE has hawlRequirement NOT_REQUIRED', () => {
    const agri = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'AGRICULTURAL_PRODUCE');
    expect(agri?.classification.hawlRequirement).toBe('NOT_REQUIRED');
  });

  test('All liability categories have nisabBase NOT_APPLICABLE', () => {
    const liabilities = BASELINE_CANONICAL_ZAKAT_CATEGORIES.filter(c => c.classification.isLiability);
    for (const cat of liabilities) {
      expect(cat.classification.nisabBase).toBe('NOT_APPLICABLE');
    }
  });

  test('Livestock categories have correct nisab bases', () => {
    const camels = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'LIVESTOCK_CAMELS');
    const cattle = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'LIVESTOCK_CATTLE');
    const sheep  = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'LIVESTOCK_SHEEP_GOATS');
    expect(camels?.classification.nisabBase).toBe('CAMEL_COUNT');
    expect(cattle?.classification.nisabBase).toBe('CATTLE_COUNT');
    expect(sheep?.classification.nisabBase).toBe('SHEEP_GOAT_COUNT');
  });

  test('GOLD has nisabBase GOLD_85_GRAMS', () => {
    const gold = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'GOLD');
    expect(gold?.classification.nisabBase).toBe('GOLD_85_GRAMS');
  });

  test('SILVER has nisabBase SILVER_595_GRAMS', () => {
    const silver = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'SILVER');
    expect(silver?.classification.nisabBase).toBe('SILVER_595_GRAMS');
  });

  test('GOLD and SILVER have valueType WEIGHT_GRAMS', () => {
    const gold   = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'GOLD');
    const silver = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find(c => c.categoryId === 'SILVER');
    expect(gold?.classification.valueType).toBe('WEIGHT_GRAMS');
    expect(silver?.classification.valueType).toBe('WEIGHT_GRAMS');
  });

  test('All livestock categories have valueType UNITS', () => {
    const livestock = BASELINE_CANONICAL_ZAKAT_CATEGORIES.filter(c => c.classification.domain === 'LIVESTOCK');
    for (const cat of livestock) {
      expect(cat.classification.valueType).toBe('UNITS');
    }
  });

  test('Category entity records do not contain zakatable status decisions', () => {
    // Confirm that no entity has a hardcoded zakatableOverride = true/false
    // at the entity level (only madhhab entries may have overrides, and only for
    // universally obvious cases)
    for (const category of BASELINE_CANONICAL_ZAKAT_CATEGORIES) {
      // The entity itself should not have a zakatableOverride field
      // (that's per madhhab entry only)
      expect((category as any).zakatableOverride).toBeUndefined();
    }
  });
});
