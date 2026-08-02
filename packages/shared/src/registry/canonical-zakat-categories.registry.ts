/**
 * MIZAN — Baseline Canonical Zakat Category Registry (Phase 8)
 *
 * The initial baseline of 22 permanent canonical Zakat category entity records.
 *
 * CRITICAL CONSTRAINTS:
 * - These records define IDENTITY, PRESENTATION, and INPUT SUPPORT metadata ONLY.
 * - Whether a category is zakatable is determined exclusively by the Rule Engine.
 * - Nisab thresholds, rates, and aggregation rules are determined by the Rule Engine.
 * - These records are DRAFT status and must pass scholar governance before PRODUCTION.
 */

import type {
  ZakatCategoryEntityRecord,
  CanonicalZakatCategoryId,
  ZakatCategoryDomain,
  ZakatValueType,
  ZakatNisabBase,
  ZakatHawlRequirement,
  ZakatCategoryMadhhabEntry,
} from '../types/zakat/canonical-zakat-category.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'c'.repeat(64);
const SUPPORTED: ZakatCategoryMadhhabEntry = { inputSupportStatus: 'SUPPORTED' };
const NOT_YET: ZakatCategoryMadhhabEntry   = { inputSupportStatus: 'NOT_YET_MODELLED' };

function createBaselineCategory(
  categoryId: CanonicalZakatCategoryId,
  canonicalName: string,
  domain: ZakatCategoryDomain,
  valueType: ZakatValueType,
  nisabBase: ZakatNisabBase,
  hawlRequirement: ZakatHawlRequirement,
  isLiability: boolean,
  groupMemberships: string[],
  jafariEntry: ZakatCategoryMadhhabEntry = SUPPORTED,
  allowsItemBreakdown = false,
  requiresIrrigationMethod = false,
): ZakatCategoryEntityRecord {
  return {
    categoryId,
    version: '1.0.0',
    schemaVersion: '1.0.0',
    canonicalName,
    classification: {
      domain,
      valueType,
      nisabBase,
      hawlRequirement,
      isLiability,
    },
    localization: {
      labelKey:       `zakat.category.${categoryId}.label`,
      descriptionKey: `zakat.category.${categoryId}.description`,
      reportLabelKey: `zakat.category.${categoryId}.report_label`,
      placeholderKey: `zakat.category.${categoryId}.placeholder`,
    },
    madhhabMetadata: {
      HANAFI:  SUPPORTED,
      MALIKI:  SUPPORTED,
      SHAFII:  SUPPORTED,
      HANBALI: SUPPORTED,
      JAFARI:  jafariEntry,
    },
    groupMemberships,
    inputMetadata: {
      valueType,
      minimumValue: 0,
      maximumValue: null,
      allowsItemBreakdown,
      isUserInput: !isLiability || categoryId === 'CURRENT_LIABILITIES' || categoryId === 'DEFERRED_LIABILITIES',
      requiresIrrigationMethod: requiresIrrigationMethod || undefined,
    },
    governance: {
      status: 'DRAFT',
      effectiveFrom: NOW,
    },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  };
}

export const BASELINE_CANONICAL_ZAKAT_CATEGORIES: ZakatCategoryEntityRecord[] = [

  // ── Monetary & Liquid Assets ────────────────────────────────────────────────
  createBaselineCategory(
    'CASH_AND_BANK',
    'Cash and Bank Accounts',
    'MONETARY', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['MONETARY_ASSETS', 'ALL_ZAKATABLE_ASSETS'],
  ),
  createBaselineCategory(
    'FOREIGN_CURRENCY',
    'Foreign Currency Holdings',
    'MONETARY', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['MONETARY_ASSETS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
  ),
  createBaselineCategory(
    'DIGITAL_CURRENCY',
    'Digital Currency and Cryptocurrency',
    'MONETARY', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['MONETARY_ASSETS'],
    { inputSupportStatus: 'REVIEW_REQUIRED', scholarNotes: 'Contemporary fiqh debate; madhhab positions vary. Scholar review required before production.' },
  ),

  // ── Precious Metals ─────────────────────────────────────────────────────────
  createBaselineCategory(
    'GOLD',
    'Gold',
    'PRECIOUS_METALS', 'WEIGHT_GRAMS', 'GOLD_85_GRAMS', 'REQUIRED', false,
    ['PRECIOUS_METALS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    false, false,
  ),
  createBaselineCategory(
    'SILVER',
    'Silver',
    'PRECIOUS_METALS', 'WEIGHT_GRAMS', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['PRECIOUS_METALS', 'ALL_ZAKATABLE_ASSETS'],
  ),

  // ── Trade & Business Assets ─────────────────────────────────────────────────
  createBaselineCategory(
    'BUSINESS_INVENTORY',
    'Business Inventory and Trading Stock',
    'TRADE', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['TRADE_ASSETS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),
  createBaselineCategory(
    'BUSINESS_RECEIVABLES',
    "Business Receivables (Amounts Owed to the Business)",
    'TRADE', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['TRADE_ASSETS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),
  createBaselineCategory(
    'BUSINESS_INVESTMENTS',
    'Business Equity and Investments',
    'TRADE', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['TRADE_ASSETS', 'FINANCIAL_INVESTMENTS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),

  // ── Financial Investments ───────────────────────────────────────────────────
  createBaselineCategory(
    'QUOTED_INVESTMENTS',
    'Quoted Investments (Listed Stocks and Funds)',
    'INVESTMENTS', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['FINANCIAL_INVESTMENTS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),
  createBaselineCategory(
    'UNQUOTED_INVESTMENTS',
    'Unquoted Investments (Private Equity and Unlisted Shares)',
    'INVESTMENTS', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['FINANCIAL_INVESTMENTS', 'ALL_ZAKATABLE_ASSETS'],
    { inputSupportStatus: 'NOT_YET_MODELLED', scholarNotes: 'Valuation methodology requires scholar review per madhhab.' },
    true,
  ),
  createBaselineCategory(
    'PENSION_FUNDS',
    'Pension and Retirement Fund Value',
    'INVESTMENTS', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'MADHHAB_SPECIFIC', false,
    ['FINANCIAL_INVESTMENTS'],
    { inputSupportStatus: 'REVIEW_REQUIRED', scholarNotes: 'Treatment varies: some scholars exempt pension funds until access; others zakate the accessible portion.' },
  ),
  createBaselineCategory(
    'BONDS_AND_SUKUK',
    'Bonds and Sukuk (Islamic Fixed Income)',
    'INVESTMENTS', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['FINANCIAL_INVESTMENTS', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),

  // ── Receivables & Loans ─────────────────────────────────────────────────────
  createBaselineCategory(
    'PERSONAL_RECEIVABLES',
    'Personal Receivables (Amounts Owed to the Individual)',
    'RECEIVABLES', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['RECEIVABLES', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),
  createBaselineCategory(
    'LOAN_GIVEN',
    'Loans Given (Recoverable Loans)',
    'RECEIVABLES', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'MADHHAB_SPECIFIC', false,
    ['RECEIVABLES', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    true,
  ),

  // ── Agricultural Produce ────────────────────────────────────────────────────
  createBaselineCategory(
    'AGRICULTURAL_PRODUCE',
    'Agricultural Produce (Crops and Harvests)',
    'AGRICULTURE', 'UNITS', 'PRODUCE_WEIGHT', 'NOT_REQUIRED', false,
    ['AGRICULTURAL', 'ALL_ZAKATABLE_ASSETS'],
    SUPPORTED,
    false,
    true, // requiresIrrigationMethod
  ),

  // ── Livestock ───────────────────────────────────────────────────────────────
  createBaselineCategory(
    'LIVESTOCK_CAMELS',
    'Livestock — Camels (Ibil)',
    'LIVESTOCK', 'UNITS', 'CAMEL_COUNT', 'REQUIRED', false,
    ['LIVESTOCK', 'ALL_ZAKATABLE_ASSETS'],
  ),
  createBaselineCategory(
    'LIVESTOCK_CATTLE',
    'Livestock — Cattle and Buffalo (Baqar)',
    'LIVESTOCK', 'UNITS', 'CATTLE_COUNT', 'REQUIRED', false,
    ['LIVESTOCK', 'ALL_ZAKATABLE_ASSETS'],
  ),
  createBaselineCategory(
    'LIVESTOCK_SHEEP_GOATS',
    'Livestock — Sheep and Goats (Ghanam)',
    'LIVESTOCK', 'UNITS', 'SHEEP_GOAT_COUNT', 'REQUIRED', false,
    ['LIVESTOCK', 'ALL_ZAKATABLE_ASSETS'],
  ),

  // ── Income & Savings ────────────────────────────────────────────────────────
  createBaselineCategory(
    'RENTAL_INCOME',
    'Net Rental Income from Investment Property',
    'INCOME', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'MADHHAB_SPECIFIC', false,
    ['INCOME_AND_SAVINGS', 'ALL_ZAKATABLE_ASSETS'],
    { inputSupportStatus: 'REVIEW_REQUIRED', scholarNotes: 'Contemporary fiqh differs on whether net rental income is zakatable annually. Scholar review required.' },
  ),
  createBaselineCategory(
    'SAVINGS_DEPOSITS',
    'Fixed-Term Savings and Bank Deposits',
    'INCOME', 'CURRENCY_AMOUNT', 'SILVER_595_GRAMS', 'REQUIRED', false,
    ['INCOME_AND_SAVINGS', 'ALL_ZAKATABLE_ASSETS'],
  ),

  // ── Liabilities ─────────────────────────────────────────────────────────────
  createBaselineCategory(
    'CURRENT_LIABILITIES',
    'Current Liabilities (Debts Currently Due)',
    'LIABILITIES', 'CURRENCY_AMOUNT', 'NOT_APPLICABLE', 'NOT_APPLICABLE', true,
    ['LIABILITIES', 'ALL_DEDUCTIBLE_LIABILITIES'],
    SUPPORTED,
    true,
  ),
  createBaselineCategory(
    'DEFERRED_LIABILITIES',
    'Deferred Liabilities (Longer-Term Debts)',
    'LIABILITIES', 'CURRENCY_AMOUNT', 'NOT_APPLICABLE', 'NOT_APPLICABLE', true,
    ['LIABILITIES', 'ALL_DEDUCTIBLE_LIABILITIES'],
    { inputSupportStatus: 'REVIEW_REQUIRED', scholarNotes: 'Treatment of deferred liabilities varies significantly by madhhab. Scholar review required before production.' },
    true,
  ),
];

// ─── Index for O(1) Lookup ────────────────────────────────────────────────────

export const CANONICAL_ZAKAT_CATEGORY_INDEX: ReadonlyMap<CanonicalZakatCategoryId, ZakatCategoryEntityRecord> =
  new Map(BASELINE_CANONICAL_ZAKAT_CATEGORIES.map(c => [c.categoryId, c]));

/**
 * Look up a canonical Zakat category entity by its permanent ID.
 * Returns undefined if the ID is not in the baseline registry.
 */
export function getZakatCategoryById(id: CanonicalZakatCategoryId): ZakatCategoryEntityRecord | undefined {
  return CANONICAL_ZAKAT_CATEGORY_INDEX.get(id);
}

/**
 * List all baseline Zakat category IDs.
 */
export function listZakatCategoryIds(): CanonicalZakatCategoryId[] {
  return BASELINE_CANONICAL_ZAKAT_CATEGORIES.map(c => c.categoryId);
}
