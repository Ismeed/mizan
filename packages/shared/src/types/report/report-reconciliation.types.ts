/**
 * MIZAN — Report Reconciliation Section Contract (Phase 14)
 */

export type ReportReconciliationStatus =
  | 'RECONCILED'
  | 'RECONCILED_WITH_ROUNDING'
  | 'NOT_RECONCILED'
  | 'REVIEW_REQUIRED';

export interface ReportReconciliationCheck {
  checkCode: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED';
  relatedResultItemIds: string[];
}

export interface ReportReconciliationContent {
  status: ReportReconciliationStatus;
  monetaryTotals: Array<{ currencyCode: string; amountMinor: string; decimalAmount: string }>;
  physicalTotals: Array<{ unit: string; totalQuantity: number }>;
  livestockObligations: Array<{ animalType: string; count: number; obligation: string }>;
  agricultureObligations: Array<{ produce: string; harvestKg: number; obligationKg: number }>;
  roundingAdjustments: Array<{ currencyCode: string; adjustmentMinor: string }>;
  remainders: Array<{ type: string; description: string }>;
  checks: ReportReconciliationCheck[];
}
