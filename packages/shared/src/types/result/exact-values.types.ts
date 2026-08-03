/**
 * MIZAN — Exact Values Contract (Phase 13)
 * Exact representations of fractions, rates, quantities, and counts.
 */

export interface ExactFractionValue {
  valueId: string;
  numerator: number | string;
  denominator: number | string;
}

export interface ExactRateValue {
  valueId: string;
  representation: 'RATIONAL' | 'DECIMAL_STRING';
  numerator?: number | string;
  denominator?: number | string;
  decimalString?: string;
}

export interface ExactQuantityValue {
  valueId: string;
  value: string;
  unitId: string;
}

export interface ExactCountValue {
  valueId: string;
  value: number;
}

export interface ExactValues {
  fractions: ExactFractionValue[];
  rates: ExactRateValue[];
  quantities: ExactQuantityValue[];
  counts: ExactCountValue[];
}
