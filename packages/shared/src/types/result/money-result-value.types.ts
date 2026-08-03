/**
 * MIZAN — Money Result Contract (Phase 13)
 * Financial allocations associated with result items using canonical MoneyValue.
 */

import type { MoneyValue } from '../currency/money.types';

export type MonetaryValueRole =
  | 'INPUT'
  | 'CALCULATION_BASE'
  | 'UNROUNDED_RESULT'
  | 'FINAL_RESULT'
  | 'CONVERSION_RESULT'
  | 'ROUNDING_ADJUSTMENT';

export interface MoneyResultValue {
  valueId: string;
  role: MonetaryValueRole;
  money: MoneyValue;
  sourceValueId?: string | null;
  exchangeRateSnapshotId?: string | null;
  roundingPolicyId?: string | null;
}
