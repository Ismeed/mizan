/**
 * MIZAN — Hijab Report Content Adapter (Phase 14)
 * Formats inheritance blocking (Hijab Hirman & Hijab Nuqsan) for report sections.
 */

import type { ResultItem } from '@mizan/shared';

export class HijabReportContentAdapter {
  static formatHijabItem(item: ResultItem) {
    return {
      heir: item.subject.subjectId,
      status: item.status,
      blockedBy: item.authoritativePayload?.blockedBy ?? 'CANONICAL_HEIR_RULE',
      removeFromShareDistribution: item.authoritativePayload?.removeFromShareDistribution ?? true,
      decisionCode: item.decision.decisionCode,
      evidenceReferences: item.evidenceLinks.map((e) => e.evidenceId),
    };
  }
}
