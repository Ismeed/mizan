/**
 * MIZAN — Agriculture Report Content Adapter (Phase 14)
 * Formats physical agricultural harvest produce obligations.
 */

import type { ResultItem } from '@mizan/shared';

export class AgricultureReportContentAdapter {
  static formatAgricultureItem(item: ResultItem) {
    const payload = item.authoritativePayload;
    return {
      produceType: item.subject.subjectId,
      status: item.status,
      irrigationClassification: payload?.irrigationClassification,
      exactRate: item.exactValues?.rates?.[0] ?? { numerator: 1, denominator: 10 },
      harvestQuantityKg: payload?.harvestQuantityKg,
      obligationQuantityKg: payload?.obligationQuantityKg,
      decisionCode: item.decision.decisionCode,
      evidenceReferences: item.evidenceLinks.map((e) => e.evidenceId),
    };
  }
}
