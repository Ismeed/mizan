/**
 * MIZAN — Zakat Category Normalization Tests (Phase 8)
 *
 * Tests the ZakatNormalizationService alias resolution,
 * legacy migration, and ambiguity detection.
 */

import { ZAKAT_LEGACY_ALIAS_REGISTRY, ZAKAT_LEGACY_MIGRATION_STATUS, resolveLegacyZakatAlias } from '@mizan/shared';

describe('Zakat Legacy Alias Registry', () => {
  test('Registry is non-empty', () => {
    expect(ZAKAT_LEGACY_ALIAS_REGISTRY.length).toBeGreaterThan(0);
  });

  test('All alias records have required fields', () => {
    for (const alias of ZAKAT_LEGACY_ALIAS_REGISTRY) {
      expect(alias.aliasText).toBeTruthy();
      expect(alias.targetCategoryId).toBeTruthy();
      expect(alias.aliasType).toBeTruthy();
      expect(alias.matchingMode).toBeTruthy();
      expect(typeof alias.isDeprecated).toBe('boolean');
    }
  });

  test('All target category IDs are uppercase snake case', () => {
    for (const alias of ZAKAT_LEGACY_ALIAS_REGISTRY) {
      expect(alias.targetCategoryId).toMatch(/^[A-Z][A-Z0-9_]*[A-Z0-9]$/);
    }
  });

  test('resolveLegacyZakatAlias resolves "cash" to CASH_AND_BANK', () => {
    const result = resolveLegacyZakatAlias('cash');
    expect(result).toBeDefined();
    expect(result?.targetCategoryId).toBe('CASH_AND_BANK');
  });

  test('resolveLegacyZakatAlias resolves "dhahab" to GOLD', () => {
    const result = resolveLegacyZakatAlias('dhahab');
    expect(result).toBeDefined();
    expect(result?.targetCategoryId).toBe('GOLD');
  });

  test('resolveLegacyZakatAlias resolves "ibil" to LIVESTOCK_CAMELS', () => {
    const result = resolveLegacyZakatAlias('ibil');
    expect(result).toBeDefined();
    expect(result?.targetCategoryId).toBe('LIVESTOCK_CAMELS');
  });

  test('resolveLegacyZakatAlias returns undefined for unknown term', () => {
    const result = resolveLegacyZakatAlias('unknown_term_xyz');
    expect(result).toBeUndefined();
  });
});

describe('Zakat Legacy Migration Status', () => {
  test('CASH migration status is VERIFIED → CASH_AND_BANK', () => {
    const entry = ZAKAT_LEGACY_MIGRATION_STATUS['CASH'];
    expect(entry).toBeDefined();
    expect(entry.status).toBe('VERIFIED');
    expect(entry.canonicalId).toBe('CASH_AND_BANK');
  });

  test('GOLD migration status is VERIFIED → GOLD', () => {
    const entry = ZAKAT_LEGACY_MIGRATION_STATUS['GOLD'];
    expect(entry.status).toBe('VERIFIED');
    expect(entry.canonicalId).toBe('GOLD');
  });

  test('LIVESTOCK migration status is REVIEW_REQUIRED', () => {
    const entry = ZAKAT_LEGACY_MIGRATION_STATUS['LIVESTOCK'];
    expect(entry.status).toBe('REVIEW_REQUIRED');
  });

  test('INVESTMENTS migration status is REVIEW_REQUIRED', () => {
    const entry = ZAKAT_LEGACY_MIGRATION_STATUS['INVESTMENTS'];
    expect(entry.status).toBe('REVIEW_REQUIRED');
  });

  test('All VERIFIED entries have a canonical ID', () => {
    for (const [key, entry] of Object.entries(ZAKAT_LEGACY_MIGRATION_STATUS)) {
      if (entry.status === 'VERIFIED') {
        expect(entry.canonicalId).toBeTruthy();
      }
    }
  });

  test('No legacy key contains lowercase characters', () => {
    // Legacy keys are uppercase enum values
    for (const key of Object.keys(ZAKAT_LEGACY_MIGRATION_STATUS)) {
      expect(key).toMatch(/^[A-Z_]+$/);
    }
  });
});
