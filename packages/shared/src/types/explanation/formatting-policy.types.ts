/**
 * Formatting Policy Types (Fraction, Money, Quantity)
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export interface FractionFormattingPolicy {
  policyId: string;
  displayModes: {
    compact: 'SYMBOLIC' | 'WORDS' | 'PERCENTAGE';
    full: 'SYMBOLIC_AND_WORDS' | 'SYMBOLIC' | 'WORDS';
    report: 'SYMBOLIC_WORDS_AND_PERCENTAGE' | 'SYMBOLIC_AND_WORDS';
  };
  preserveExactFraction: true; // Mandatory true
}

export interface MoneyFormattingPolicy {
  policyId: string;
  locale: string;
  currencyCode: string;
  showCurrencySymbol: boolean;
  useAccountingFormat: boolean;
}

export interface QuantityFormattingPolicy {
  policyId: string;
  locale: string;
  unitId: string;
  showUnitLabel: boolean;
  pluralRule: string;
}
