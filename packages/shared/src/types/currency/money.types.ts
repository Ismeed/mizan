/**
 * MIZAN — Canonical Money Value Object Types (Phase 12)
 *
 * Defines exact monetary representation to prevent IEEE-754 binary floating point errors.
 */

export type MoneyRepresentationType =
  | 'MINOR_UNITS'
  | 'ARBITRARY_PRECISION_DECIMAL';

export interface MoneyValue {
  currencyCode: string;
  representationType: MoneyRepresentationType;
  /** Amount in minor units as exact integer string (e.g., "250000000" for ₦2,500,000.00) */
  amountMinor: string;
  /** Arbitrary precision decimal string representation (e.g. "2500000.00") */
  decimalAmount: string;
  minorUnitDigits: number;
}

export interface CurrencyMetadataSnapshot {
  currencyVersion: string;
  minorUnitDigits: number;
  symbol: string;
}

export interface MoneySnapshot {
  currencyCode: string;
  value: MoneyValue;
  currencyMetadataSnapshot: CurrencyMetadataSnapshot;
}

export interface ExactAllocation {
  numeratorAmountMinor: string;
  denominator: string;
}

export interface RoundedAllocation {
  currencyCode: string;
  amountMinor: string;
  decimalAmount: string;
  roundingAdjustmentMinor: string;
}
