/**
 * MIZAN — Result Reconciliation Contract (Phase 13)
 * Reconciliation details verifying exact shares, distribution, and Zakat obligations.
 */

import type { MoneyValue } from '../currency/money.types';

export type ReconciliationStatus =
  | 'RECONCILED'
  | 'RECONCILED_WITH_ROUNDING'
  | 'NOT_RECONCILED'
  | 'REVIEW_REQUIRED';

export interface ReconciliationCheckItem {
  checkCode: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  details?: string | null;
}

export interface MirathReconciliation {
  status: ReconciliationStatus;
  exactShareTotal: {
    numerator: number | string;
    denominator: number | string;
  };
  monetaryTotals: {
    netEstate: MoneyValue[];
    distributed: MoneyValue[];
    remainder: MoneyValue[];
  };
  checks: ReconciliationCheckItem[];
}

export interface ZakatReconciliation {
  status: ReconciliationStatus;
  monetaryObligationsTotal: MoneyValue[];
  physicalObligationCount: number;
  livestockObligationCount: number;
  checks: ReconciliationCheckItem[];
}
