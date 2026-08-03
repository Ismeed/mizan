/**
 * MIZAN — Livestock Report Content Adapter (Phase 14)
 * Formats physical livestock obligations without forcing artificial monetary conversion.
 */

import type { ResultItem } from '@mizan/shared';

export class LivestockReportContentAdapter {
  static formatLivestockItem(item: ResultItem) {
    const payload = item.authoritativePayload;
    return {
      animalType: item.subject.subjectId,
      status: item.status,
      scheduleId: payload?.scheduleId,
      matchedBandId: payload?.matchedBandId,
      herdCount: payload?.herdCount,
      animalObligations: payload?.animalObligations ?? [],
      decisionCode: item.decision.decisionCode,
      evidenceReferences: item.evidenceLinks.map((e) => e.evidenceId),
    };
  }
}
