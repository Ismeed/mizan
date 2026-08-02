/**
 * MIZAN — Canonical Zakat Category Identifier & Entity Types (Phase 8)
 *
 * Defines the permanent, machine-readable identifiers for every Zakat
 * wealth category, asset type, eligibility decision, nisab decision,
 * aggregation decision, and rate decision.
 *
 * CRITICAL CONSTRAINTS:
 * - Every identifier must be UPPERCASE_SNAKE_CASE ASCII English technical terminology
 * - No translated term may become a canonical ID
 * - No madhhab name may appear inside a canonical ID
 * - Registry inclusion does NOT imply zakatable status
 * - Zakatable status, nisab, and rate are determined by the Rule Engine only
 * - These identifiers are PERMANENT — once published to PRODUCTION they
 *   cannot be renamed, reused, or deleted (only deprecated)
 *
 * @module Phase 8 — Canonical Zakat Category Registry
 */

// ─── Canonical Zakat Category Identifiers ────────────────────────────────────

/**
 * The complete union of all permanent Zakat wealth category identifiers.
 *
 * Format: UPPERCASE_SNAKE_CASE
 * Must consist only of A-Z, 0-9, and underscores.
 * Must NOT contain madhhab names, translated terms, or screen labels.
 */
export type CanonicalZakatCategoryId =
  // ── Monetary & Liquid Assets ─────────────────────────────────────────────
  | 'CASH_AND_BANK'         // Cash in hand and bank current/savings accounts
  | 'FOREIGN_CURRENCY'      // Currency holdings other than base currency
  | 'DIGITAL_CURRENCY'      // Cryptocurrency and digital tokens

  // ── Precious Metals ───────────────────────────────────────────────────────
  | 'GOLD'                  // Gold in any form (jewellery, bullion, coins)
  | 'SILVER'                // Silver in any form

  // ── Trade & Business Assets ───────────────────────────────────────────────
  | 'BUSINESS_INVENTORY'    // Stock intended for trade
  | 'BUSINESS_RECEIVABLES'  // Amounts owed to the business
  | 'BUSINESS_INVESTMENTS'  // Business equity stakes

  // ── Financial Investments ─────────────────────────────────────────────────
  | 'QUOTED_INVESTMENTS'    // Publicly traded stocks and funds at market value
  | 'UNQUOTED_INVESTMENTS'  // Private equity and unlisted shares
  | 'PENSION_FUNDS'         // Pension and retirement fund value
  | 'BONDS_AND_SUKUK'       // Fixed-income instruments and Islamic bonds

  // ── Receivables & Loans ───────────────────────────────────────────────────
  | 'PERSONAL_RECEIVABLES'  // Money owed to the individual that is expected to be repaid
  | 'LOAN_GIVEN'            // Loans given out (recoverable loans)

  // ── Agricultural Produce ─────────────────────────────────────────────────
  | 'AGRICULTURAL_PRODUCE'  // Grains, fruits, and produce at time of harvest

  // ── Livestock ─────────────────────────────────────────────────────────────
  | 'LIVESTOCK_CAMELS'      // Camels (ibil)
  | 'LIVESTOCK_CATTLE'      // Cattle and buffalo (baqar)
  | 'LIVESTOCK_SHEEP_GOATS' // Sheep and goats (ghanam)

  // ── Rental & Property Income ─────────────────────────────────────────────
  | 'RENTAL_INCOME'         // Net rental income from property held for investment
  | 'SAVINGS_DEPOSITS'      // Fixed-term savings and deposits

  // ── Liabilities ───────────────────────────────────────────────────────────
  | 'CURRENT_LIABILITIES'   // Debts currently due and payable
  | 'DEFERRED_LIABILITIES'  // Longer-term liabilities (madhhab-specific treatment);

// ─── Category Classification ──────────────────────────────────────────────────

/** High-level domain grouping of a Zakat category */
export type ZakatCategoryDomain =
  | 'MONETARY'          // Cash, currencies, and equivalents
  | 'PRECIOUS_METALS'   // Gold and silver
  | 'TRADE'             // Business inventory, receivables, equity
  | 'INVESTMENTS'       // Financial instruments
  | 'RECEIVABLES'       // Loans given and amounts owed to the person
  | 'AGRICULTURE'       // Crops, produce
  | 'LIVESTOCK'         // Animals
  | 'INCOME'            // Rental income and salary (madhhab-specific)
  | 'LIABILITIES';      // Deductible liabilities

/** Whether the category holds an amount in currency or a physical quantity */
export type ZakatValueType =
  | 'CURRENCY_AMOUNT'   // Value expressed as a monetary amount (e.g. cash, investments)
  | 'WEIGHT_GRAMS'      // Value expressed as physical weight (gold, silver)
  | 'UNITS'             // Physical count (livestock, crops in kg)
  | 'PERCENTAGE'        // Percentage of another amount
  | 'DERIVED';          // Computed from other categories

/** Nisab measurement base used to determine threshold for this category */
export type ZakatNisabBase =
  | 'GOLD_85_GRAMS'        // Based on 85g of gold (7.5 tola)
  | 'SILVER_595_GRAMS'     // Based on 595g of silver (52.5 tola / 200 dirhams)
  | 'PRODUCE_WEIGHT'       // Based on specific produce weight (5 wasq = 653 kg)
  | 'CAMEL_COUNT'          // Nisab based on number of camels (5 camels)
  | 'CATTLE_COUNT'         // Nisab based on number of cattle (30)
  | 'SHEEP_GOAT_COUNT'     // Nisab based on number of sheep/goats (40)
  | 'MADHHAB_SPECIFIC'     // Nisab calculation varies by madhhab
  | 'NOT_APPLICABLE';      // This category is a liability, not an asset

/** Harvest/year cycle for time-based obligations */
export type ZakatHawlRequirement =
  | 'REQUIRED'         // Hawl (one lunar year in possession) is required
  | 'NOT_REQUIRED'     // No hawl — obligation arises at harvest or acquisition
  | 'MADHHAB_SPECIFIC' // Hawl requirement varies by madhhab
  | 'NOT_APPLICABLE';  // For liabilities and derived categories

/** Governance/support status for this category entity */
export type ZakatCategoryGovernanceStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED'
  | 'INDEXED'
  | 'PRODUCTION'
  | 'DEPRECATED';

/** Whether this category is currently supported as an input in a given madhhab */
export type ZakatCategoryInputSupportStatus =
  | 'SUPPORTED'          // Fully supported as a user-input category in this madhhab
  | 'NOT_SUPPORTED'      // This category is not recognised in this madhhab
  | 'NOT_YET_MODELLED'   // Recognised by scholars but not yet implemented in MIZAN
  | 'REVIEW_REQUIRED';   // Existing implementation needs scholar review

// ─── Category Madhhab Metadata ───────────────────────────────────────────────

export interface ZakatCategoryMadhhabEntry {
  inputSupportStatus: ZakatCategoryInputSupportStatus;
  /**
   * Madhhab-specific zakatable status override.
   * undefined = defer to the Rule Engine (preferred).
   * Only set when a category is universally zakatable or universally exempt
   * in this madhhab without any conditions.
   */
  zakatableOverride?: boolean;
  /**
   * Madhhab-specific nisab base override.
   * undefined = defer to the Rule Engine.
   */
  nisabBaseOverride?: ZakatNisabBase;
  /** Scholar notes explaining madhhab-specific treatment */
  scholarNotes?: string;
}

export interface ZakatCategoryMadhhabMetadata {
  HANAFI:  ZakatCategoryMadhhabEntry;
  MALIKI:  ZakatCategoryMadhhabEntry;
  SHAFII:  ZakatCategoryMadhhabEntry;
  HANBALI: ZakatCategoryMadhhabEntry;
  JAFARI:  ZakatCategoryMadhhabEntry;
}

// ─── Category Localization Keys ───────────────────────────────────────────────

export interface ZakatCategoryLocalizationKeys {
  /** i18n key for the canonical category label (e.g. "zakat.category.GOLD.label") */
  labelKey: string;
  /** i18n key for a longer description */
  descriptionKey: string;
  /** i18n key for the user-facing category name in reports */
  reportLabelKey: string;
  /** i18n key for the input placeholder text */
  placeholderKey?: string;
}

// ─── Category Input Metadata ──────────────────────────────────────────────────

export interface ZakatCategoryInputMetadata {
  /** The value type this category accepts */
  valueType: ZakatValueType;
  /** Minimum value (e.g. 0) */
  minimumValue: number;
  /** Maximum value, or null for unlimited */
  maximumValue: number | null;
  /** Currency code, weight unit, or count unit for display */
  unit?: string;
  /**
   * Whether this category allows the user to enter individual item
   * breakdowns (e.g. listing individual stocks)
   */
  allowsItemBreakdown: boolean;
  /** Whether this is an input category (true) or computed (false) */
  isUserInput: boolean;
  /**
   * Additional irrigation method selection for agricultural produce.
   * Only applicable to AGRICULTURAL_PRODUCE.
   */
  requiresIrrigationMethod?: boolean;
}

// ─── Category Classification ──────────────────────────────────────────────────

export interface ZakatCategoryClassification {
  domain: ZakatCategoryDomain;
  valueType: ZakatValueType;
  nisabBase: ZakatNisabBase;
  hawlRequirement: ZakatHawlRequirement;
  /** Whether this is a deductible liability category */
  isLiability: boolean;
  /**
   * Whether this category must be aggregated with others to
   * reach the nisab threshold.
   * undefined = Rule Engine determines.
   */
  requiresAggregation?: boolean;
}

// ─── Category Governance ──────────────────────────────────────────────────────

export interface ZakatCategoryGovernance {
  status: ZakatCategoryGovernanceStatus;
  effectiveFrom: string;
  effectiveUntil?: string;
}

// ─── Category Integrity ───────────────────────────────────────────────────────

export interface ZakatCategoryIntegrity {
  contentChecksum: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// ─── Full Canonical Zakat Category Entity ────────────────────────────────────

/**
 * The complete, immutable definition of a Zakat wealth category.
 *
 * CRITICAL:
 * - This record defines IDENTITY, PRESENTATION, and INPUT SUPPORT metadata ONLY.
 * - Whether a category is zakatable is determined exclusively by the Rule Engine.
 * - Whether a category combines with others for nisab is determined by the Rule Engine.
 * - Rate decisions (2.5%, 5%, 10%) are determined by the Rule Engine.
 * - This record MUST NOT contain any eligibility or rate decisions.
 */
export interface ZakatCategoryEntityRecord {
  /** Permanent uppercase canonical category identifier */
  categoryId: CanonicalZakatCategoryId;
  /** Semantic version of this entity record, e.g. "1.0.0" */
  version: string;
  /** Schema version this record was authored against */
  schemaVersion: string;
  /** Human-readable canonical English category name (for developer reference only) */
  canonicalName: string;
  /** Classification metadata */
  classification: ZakatCategoryClassification;
  /** Localization i18n keys */
  localization: ZakatCategoryLocalizationKeys;
  /** Per-madhhab support and treatment metadata */
  madhhabMetadata: ZakatCategoryMadhhabMetadata;
  /** Which canonical groups this category belongs to */
  groupMemberships: string[];
  /** Input metadata for the calculation UI */
  inputMetadata: ZakatCategoryInputMetadata;
  /** Governance lifecycle status */
  governance: ZakatCategoryGovernance;
  /** Content integrity record */
  integrity: ZakatCategoryIntegrity;
}
