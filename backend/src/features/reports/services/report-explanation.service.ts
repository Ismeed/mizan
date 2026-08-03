/**
 * MIZAN — Report Explanation Service (Phase 14)
 * Resolves approved explanation records linked to result items.
 */

import type { FormattedReportExplanation, CalculationResultEnvelope } from '@mizan/shared';

export class ReportExplanationService {
  static formatReportExplanations(envelope: CalculationResultEnvelope): FormattedReportExplanation[] {
    const formatted: FormattedReportExplanation[] = [];

    envelope.resultItems.forEach((item: any) => {
      const exps = item.explanationLinks ?? [];
      exps.forEach((exp: any) => {
        formatted.push({
          explanationId: exp.explanationId,
          explanationVersion: exp.explanationVersion ?? '1.0.0',
          explanationKind: 'APPROVED_EXPLANATION',
          relatedResultItemId: item.resultItemId,
          selectedMadhhab: envelope.profile.madhhab,
          shortSummary: `Approved ruling for decision ${item.decision.decisionCode}`,
          fullExplanationText: `According to the ${envelope.profile.madhhab} school, this item was evaluated under canonical rule logic.`,
          evidenceIds: (item.evidenceLinks ?? []).map((e: any) => e.evidenceId),
          translationFallbackApplied: false,
        });
      });
    });

    return formatted;
  }
}
