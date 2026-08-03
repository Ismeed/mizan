/**
 * MIZAN — Canonical Currency Definition Types (Phase 12)
 *
 * Defines the core type system for the Currency & Monetary Architecture.
 *
 * CRITICAL CONSTRAINTS:
 * - Currency codes MUST be uppercase ISO 4217 3-letter codes
 * - Currency identity is independent of symbols, language tags, madhhabs, or exchange rates
 * - Calculation logic must remain language & currency neutral
 */

import type { MadhhabCode } from '../profile.types';

// ─── Permanent Canonical Currency Roles ────────────────────────────────────────

export type CurrencyRole =
  | 'USER_PREFERRED_CURRENCY'
  | 'CALCULATION_CURRENCY'
  | 'SOURCE_ASSET_CURRENCY'
  | 'VALUATION_CURRENCY'
  | 'REPORT_CURRENCY'
  | 'SETTLEMENT_CURRENCY'
  | 'REFERENCE_CURRENCY';

// ─── Currency Types ─────────────────────────────────────────────────────────────

export type CurrencyType =
  | 'FIAT'
  | 'COMMODITY_LINKED'
  | 'DIGITAL'
  | 'INTERNAL_REFERENCE'
  | 'OTHER_APPROVED_TYPE';

export type CurrencySymbolPositionPolicy =
  | 'BEFORE_AMOUNT'
  | 'AFTER_AMOUNT'
  | 'LOCALE_CONTROLLED';

export type CurrencyGovernanceStatus =
  | 'DRAFT'
  | 'FINANCIAL_DATA_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED'
  | 'PRODUCTION'
  | 'DEPRECATED'
  | 'RETIRED';

// ─── Localized Names ────────────────────────────────────────────────────────────

export interface LocalizedCurrencyName {
  singular: string;
  plural: string;
}

export type CurrencyNamesMap = Record<string, LocalizedCurrencyName>;

// ─── Precision & Symbol Metadata ────────────────────────────────────────────────

export interface CurrencyPrecision {
  minorUnitDigits: number;
  cashDigits: number;
  accountingDigits: number;
  supportsMinorUnits: boolean;
}

export interface CurrencySymbolMetadata {
  defaultSymbol: string;
  narrowSymbol: string;
  symbolPositionPolicy: CurrencySymbolPositionPolicy;
}

export interface CurrencyRegionalMetadata {
  primaryCountryCodes: string[];
  defaultLocale: string;
}

export interface CurrencySupport {
  inputEnabled: boolean;
  calculationEnabled: boolean;
  conversionEnabled: boolean;
  reportingEnabled: boolean;
}

export interface CurrencyGovernance {
  status: CurrencyGovernanceStatus;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  reviewedBy?: {
    financialReviewedBy?: string;
    shariaReviewedBy?: string;
    technicalReviewedBy?: string;
  };
}

export interface CurrencyIntegrity {
  contentChecksum: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Canonical Currency Definition Record ───────────────────────────────────────

export interface CurrencyDefinition {
  currencyCode: string; // ISO 4217 3-letter uppercase (e.g. NGN, USD)
  version: string; // e.g. "1.0.0"
  schemaVersion: string;
  identity: {
    numericCode?: string;
    currencyType: CurrencyType;
  };
  names: CurrencyNamesMap;
  symbolMetadata: CurrencySymbolMetadata;
  precision: CurrencyPrecision;
  regionalMetadata: CurrencyRegionalMetadata;
  support: CurrencySupport;
  governance: CurrencyGovernance;
  integrity: CurrencyIntegrity;
}
