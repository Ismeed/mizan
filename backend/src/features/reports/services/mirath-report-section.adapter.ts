/**
 * MIZAN — Mirath Report Section Adapter (Phase 14)
 * Maps Mirath calculation envelope items into the 12 canonical report sections.
 * NEVER recalculates or mutates Islamic results.
 */

import type { CalculationResultEnvelope, ResultItem } from '@mizan/shared';

export class MirathReportSectionAdapter {
  static adaptSections(envelope: CalculationResultEnvelope): Record<string, any> {
    const items = envelope.resultItems;

    const estateItems = items.filter((i) => i.itemType === 'ESTATE_PREPARATION_RESULT');
    const eligibleHeirItems = items.filter((i) => i.itemType === 'FIXED_SHARE_RESULT' || i.itemType === 'RESIDUARY_RESULT' || i.itemType === 'SHARE_ADJUSTMENT_RESULT' || i.itemType === 'HEIR_DISTRIBUTION_RESULT');
    const blockedHeirItems = items.filter((i) => i.itemType === 'HIJAB_RESULT');
    const reviewItems = items.filter((i) => i.status === 'REVIEW_REQUIRED');

    return {
      REPORT_IDENTITY: {
        title: 'Mirath Calculation Report',
        module: 'MIRATH',
        calculationId: envelope.calculationId,
        resultId: envelope.resultId,
        madhhab: envelope.profile.madhhab,
        status: envelope.status,
      },
      CALCULATION_PROFILE: {
        profileId: envelope.profile.calculationProfileId,
        madhhab: envelope.profile.madhhab,
        language: envelope.profile.language,
        currency: envelope.profile.currency,
        versions: envelope.context,
      },
      INPUT_SUMMARY: {
        module: 'MIRATH',
        estateDetails: estateItems.map((i: any) => ({ label: i.subject?.instanceId, monetaryValues: i.monetaryValues })),
        totalHeirsEntered: items.length,
      },
      VALIDATION_AND_SCOPE: {
        status: envelope.input.validation.status,
        processedItems: items.length,
        supportedScope: 'FULL_MIRATH_AUTOMATION',
      },
      RESULT_SUMMARY: {
        netEstate: envelope.summary.hasMonetaryResults,
        eligibleHeirsCount: eligibleHeirItems.length,
        blockedHeirsCount: blockedHeirItems.length,
        reviewRequiredCount: reviewItems.length,
        overallStatus: envelope.status,
      },
      DETAILED_BREAKDOWN: {
        heirDistribution: eligibleHeirItems.map((item: any) => ({
          heirLabel: item.subject.subjectId,
          status: item.status,
          exactFraction: item.exactValues?.fractions?.[0] ?? null,
          monetaryValue: item.monetaryValues?.find((m: any) => m.role === 'FINAL_RESULT')?.money ?? null,
          decisionCode: item.decision.decisionCode,
        })),
      },
      EXCLUDED_AND_REVIEW_ITEMS: {
        blockedHeirs: blockedHeirItems.map((item: any) => ({
          heirLabel: item.subject.subjectId,
          status: item.status,
          blockedBy: item.authoritativePayload?.blockedBy ?? 'CANONICAL_HEIR_RULE',
          decisionCode: item.decision.decisionCode,
        })),
        reviewRequired: reviewItems.map((item: any) => ({
          subjectId: item.subject.subjectId,
          reason: item.decision.decisionCode,
        })),
      },
      EVIDENCE_AND_EXPLANATIONS: {
        evidenceCount: items.reduce((acc, i: any) => acc + (i.evidenceLinks?.length ?? 0), 0),
        explanationCount: items.reduce((acc, i: any) => acc + (i.explanationLinks?.length ?? 0), 0),
      },
      TOTALS_AND_RECONCILIATION: {
        reconciliationStatus: envelope.summary.hasPartialResults ? 'REVIEW_REQUIRED' : 'RECONCILED',
        totalItemsProcessed: items.length,
      },
      WARNINGS_AND_ACTIONS: {
        warnings: envelope.warnings,
        reviewSummary: envelope.review,
      },
      TECHNICAL_AND_AUDIT_DETAILS: {
        resultId: envelope.resultId,
        checksum: envelope.integrity.resultChecksum,
        startedAt: envelope.context.calculationStartedAt,
        completedAt: envelope.context.calculationCompletedAt,
      },
      DECLARATION_AND_CLOSING: {
        notice: 'This report is generated directly from the canonical immutable MIZAN Result Contract.',
        madhhabNotice: `Calculated strictly according to the ${envelope.profile.madhhab} school of Islamic jurisprudence.`,
      },
    };
  }
}
