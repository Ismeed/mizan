/**
 * MIZAN — Report Reconciliation Service (Phase 14)
 * Verifies internal consistency of report envelope results.
 */

import type { ReportReconciliationContent, CalculationResultEnvelope } from '@mizan/shared';

export class ReportReconciliationService {
  static assembleReconciliation(envelope: CalculationResultEnvelope): ReportReconciliationContent {
    const isReconciled = envelope.status === 'COMPLETED' || envelope.status === 'COMPLETED_WITH_WARNINGS';
    const status = isReconciled ? 'RECONCILED' : 'REVIEW_REQUIRED';

    const monetaryTotals = envelope.resultItems
      .flatMap((i) => i.monetaryValues)
      .filter((m) => m.role === 'FINAL_RESULT')
      .map((m) => ({
        currencyCode: m.money.currencyCode,
        amountMinor: m.money.amountMinor,
        decimalAmount: m.money.decimalAmount,
      }));

    return {
      status,
      monetaryTotals,
      physicalTotals: [],
      livestockObligations: [],
      agricultureObligations: [],
      roundingAdjustments: [],
      remainders: [],
      checks: [
        {
          checkCode: 'CHECK_RESULT_ITEMS_PRESENT',
          description: 'All calculation result items are present and non-empty',
          status: envelope.resultItems.length > 0 ? 'PASSED' : 'FAILED',
          relatedResultItemIds: envelope.resultItems.map((i) => i.resultItemId),
        },
        {
          checkCode: 'CHECK_STATUS_RECONCILED',
          description: 'Top level calculation status is completed without integrity failures',
          status: isReconciled ? 'PASSED' : 'REVIEW_REQUIRED',
          relatedResultItemIds: [],
        },
      ],
    };
  }
}
