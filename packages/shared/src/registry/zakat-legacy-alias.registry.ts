/**
 * MIZAN — Zakat Legacy Asset Type Alias Registry (Phase 8)
 *
 * Maps legacy values to permanent canonical Zakat category IDs.
 * Legacy values include:
 *   - camelCase keys from the old ZakatAssetInput interface
 *   - English screen labels from the legacy AssetType enum
 *   - Old enum string values from AssetType
 *
 * CRITICAL CONSTRAINTS:
 * - This registry is for INPUT NORMALIZATION ONLY.
 * - Aliases must never be used as canonical IDs in rules, reports, or facts.
 * - All legacy keys marked REVIEW_REQUIRED require scholar confirmation before production.
 * - Two-way consistency: canonical ID → alias is maintained by the canonical registry;
 *   alias → canonical ID is maintained here.
 *
 * @module Phase 8 — Legacy Migration
 */

import type { ZakatCategoryAliasRecord } from '../types/zakat/zakat-alias.types';

export const ZAKAT_LEGACY_ALIAS_REGISTRY: ZakatCategoryAliasRecord[] = [

  // ── Legacy AssetType enum values ──────────────────────────────────────────
  { aliasText: 'CASH',               targetCategoryId: 'CASH_AND_BANK',      aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',           isDeprecated: true, migrationNote: 'Old AssetType.CASH enum value. Migrate to CASH_AND_BANK.' },
  { aliasText: 'GOLD',               targetCategoryId: 'GOLD',               aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',           isDeprecated: false },
  { aliasText: 'SILVER',             targetCategoryId: 'SILVER',             aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',           isDeprecated: false },
  { aliasText: 'BUSINESS_INVENTORY', targetCategoryId: 'BUSINESS_INVENTORY', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',           isDeprecated: false },
  { aliasText: 'AGRICULTURAL',       targetCategoryId: 'AGRICULTURAL_PRODUCE', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',         isDeprecated: true, migrationNote: 'Old AssetType.AGRICULTURAL. Migrate to AGRICULTURAL_PRODUCE.' },
  { aliasText: 'LIVESTOCK',          targetCategoryId: 'LIVESTOCK_SHEEP_GOATS', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',        isDeprecated: true, migrationNote: 'Old AssetType.LIVESTOCK was undifferentiated. Now split into LIVESTOCK_CAMELS, LIVESTOCK_CATTLE, LIVESTOCK_SHEEP_GOATS. Defaulting to LIVESTOCK_SHEEP_GOATS; review required.' },
  { aliasText: 'INVESTMENTS',        targetCategoryId: 'QUOTED_INVESTMENTS', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',           isDeprecated: true, migrationNote: 'Old generic INVESTMENTS key. Now split into QUOTED_INVESTMENTS and UNQUOTED_INVESTMENTS.' },
  { aliasText: 'RECEIVABLES',        targetCategoryId: 'PERSONAL_RECEIVABLES', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',         isDeprecated: true, migrationNote: 'Old generic RECEIVABLES. Now split into PERSONAL_RECEIVABLES and BUSINESS_RECEIVABLES.' },

  // ── Legacy ZakatAssetInput camelCase field names ──────────────────────────
  { aliasText: 'cash',               targetCategoryId: 'CASH_AND_BANK',      aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'NORMALIZED_EXACT', isDeprecated: true, migrationNote: 'Legacy camelCase field: assets.cash. Migrate to CASH_AND_BANK.' },
  { aliasText: 'goldValue',          targetCategoryId: 'GOLD',               aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',            isDeprecated: true, migrationNote: 'Legacy: assets.goldValue. Migrate to GOLD.' },
  { aliasText: 'silverValue',        targetCategoryId: 'SILVER',             aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',            isDeprecated: true, migrationNote: 'Legacy: assets.silverValue. Migrate to SILVER.' },
  { aliasText: 'businessInventory',  targetCategoryId: 'BUSINESS_INVENTORY', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',            isDeprecated: true, migrationNote: 'Legacy: assets.businessInventory. Migrate to BUSINESS_INVENTORY.' },
  { aliasText: 'investments',        targetCategoryId: 'QUOTED_INVESTMENTS', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',            isDeprecated: true, migrationNote: 'Legacy: assets.investments. Migrate to QUOTED_INVESTMENTS.' },
  { aliasText: 'receivables',        targetCategoryId: 'PERSONAL_RECEIVABLES', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'EXACT',          isDeprecated: true, migrationNote: 'Legacy: assets.receivables. Migrate to PERSONAL_RECEIVABLES.' },
  { aliasText: 'agriculture',        targetCategoryId: 'AGRICULTURAL_PRODUCE', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'NORMALIZED_EXACT', isDeprecated: true, migrationNote: 'Legacy: assets.agriculture. Migrate to AGRICULTURAL_PRODUCE.' },
  { aliasText: 'livestock',          targetCategoryId: 'LIVESTOCK_SHEEP_GOATS', aliasType: 'LEGACY_CAMELCASE_KEY', matchingMode: 'NORMALIZED_EXACT', isDeprecated: true, migrationNote: 'Undifferentiated livestock key. Defaulting to LIVESTOCK_SHEEP_GOATS; user must confirm type.' },

  // ── Common English terms ──────────────────────────────────────────────────
  { aliasText: 'Cash & Bank',        targetCategoryId: 'CASH_AND_BANK',      aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Cash and Bank',      targetCategoryId: 'CASH_AND_BANK',      aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Gold',               targetCategoryId: 'GOLD',               aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Silver',             targetCategoryId: 'SILVER',             aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Business Inventory', targetCategoryId: 'BUSINESS_INVENTORY', aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Agricultural Produce', targetCategoryId: 'AGRICULTURAL_PRODUCE', aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Livestock',          targetCategoryId: 'LIVESTOCK_SHEEP_GOATS', aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, migrationNote: 'Generic "Livestock" defaults to LIVESTOCK_SHEEP_GOATS. User should specify animal type.' },
  { aliasText: 'Stocks',             targetCategoryId: 'QUOTED_INVESTMENTS', aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Shares',             targetCategoryId: 'QUOTED_INVESTMENTS', aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },
  { aliasText: 'Pension',            targetCategoryId: 'PENSION_FUNDS',      aliasType: 'COMMON_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false },

  // ── Scholarly Arabic terms (transliterations) ─────────────────────────────
  { aliasText: 'mal al tijarah',     targetCategoryId: 'BUSINESS_INVENTORY', aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'Mal al-Tijarah',     targetCategoryId: 'BUSINESS_INVENTORY', aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'nuqud',              targetCategoryId: 'CASH_AND_BANK',      aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'dhahab',             targetCategoryId: 'GOLD',               aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'fidda',              targetCategoryId: 'SILVER',             aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'ibil',               targetCategoryId: 'LIVESTOCK_CAMELS',   aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'baqar',              targetCategoryId: 'LIVESTOCK_CATTLE',   aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
  { aliasText: 'ghanam',             targetCategoryId: 'LIVESTOCK_SHEEP_GOATS', aliasType: 'SCHOLARLY_TERM', matchingMode: 'NORMALIZED_EXACT', isDeprecated: false, languageCode: 'ar' },
];

// ─── Migration Status Map ──────────────────────────────────────────────────────

/**
 * Legacy AssetType enum → canonical category ID migration status.
 * VERIFIED = safe to migrate automatically.
 * REVIEW_REQUIRED = scholar must confirm before production migration.
 */
export const ZAKAT_LEGACY_MIGRATION_STATUS: Record<string, { canonicalId: string; status: 'VERIFIED' | 'REVIEW_REQUIRED'; note?: string }> = {
  CASH:               { canonicalId: 'CASH_AND_BANK',          status: 'VERIFIED' },
  GOLD:               { canonicalId: 'GOLD',                   status: 'VERIFIED' },
  SILVER:             { canonicalId: 'SILVER',                 status: 'VERIFIED' },
  BUSINESS_INVENTORY: { canonicalId: 'BUSINESS_INVENTORY',     status: 'VERIFIED' },
  AGRICULTURAL:       { canonicalId: 'AGRICULTURAL_PRODUCE',   status: 'VERIFIED' },
  LIVESTOCK:          { canonicalId: 'LIVESTOCK_SHEEP_GOATS',  status: 'REVIEW_REQUIRED', note: 'Old LIVESTOCK was undifferentiated. Must specify camel/cattle/sheep.' },
  INVESTMENTS:        { canonicalId: 'QUOTED_INVESTMENTS',     status: 'REVIEW_REQUIRED', note: 'Old INVESTMENTS may include unquoted or pension assets. Review required.' },
  RECEIVABLES:        { canonicalId: 'PERSONAL_RECEIVABLES',   status: 'REVIEW_REQUIRED', note: 'Old RECEIVABLES may be personal or business. Review required.' },
};

// ─── Lookup Helper ─────────────────────────────────────────────────────────────

/**
 * Resolve a legacy alias text to a canonical Zakat category ID.
 * Returns undefined if not found.
 */
export function resolveLegacyZakatAlias(aliasText: string): ZakatCategoryAliasRecord | undefined {
  const normalized = aliasText.trim().toLowerCase();
  return ZAKAT_LEGACY_ALIAS_REGISTRY.find(
    a => a.matchingMode === 'NORMALIZED_EXACT'
      ? a.aliasText.trim().toLowerCase() === normalized
      : a.aliasText === aliasText
  );
}
