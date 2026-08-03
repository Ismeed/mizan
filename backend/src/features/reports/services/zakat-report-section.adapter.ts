/**
 * MIZAN — Zakat Report Section Adapter (Phase 14)
 * Maps Zakat calculation envelope items into the 12 canonical report sections.
 * NEVER recalculates or mutates Islamic results.
 */

import type { CalculationResultEnvelope } from '@mizan/shared';

export class ZakatReportSectionAdapter {
  static adaptSections(envelope: CalculationResultEnvelope): Record<string, any> {
    const items = envelope.resultItems;

    const monetaryCategoryItems = items.filter((i) => i.itemType === 'ZAKAT_CATEGORY_RESULT');
    const nisabItems = items.filter((i) => i.itemType === 'ZAKAT_NISAB_RESULT');
    const livestockItems = items.filter((i) => i.itemType === 'LIVESTOCK_OBLIGATION_RESULT');
    const agricultureItems = items.filter((i) => i.itemType === 'AGRICULTURE_OBLIGATION_RESULT');
    const reviewItems = items.filter((i) => i.status === 'REVIEW_REQUIRED');
    const notDueItems = items.filter((i) => i.status === 'NOT_DUE' || i.status === 'BELOW_NISAB');

    return {
      REPORT_IDENTITY: {
        title: 'Zakat Calculation Report',
        module: 'ZAKAT',
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
        module: 'ZAKAT',
        monetaryCategoriesCount: monetaryCategoryItems.length,
        livestockCategoriesCount: livestockItems.length,
        agricultureCategoriesCount: agricultureItems.length,
      },
      VALIDATION_AND_SCOPE: {
        status: envelope.input.validation.status,
        processedItems: items.length,
        supportedScope: 'FULL_ZAKAT_AUTOMATION',
      },
      RESULT_SUMMARY: {
        categoriesEvaluated: items.length,
        monetaryDueCount: monetaryCategoryItems.filter((i) => i.status === 'OBLIGATION_DUE').length,
        physicalDueCount: livestockItems.length + agricultureItems.length,
        notDueCount: notDueItems.length,
        overallStatus: envelope.status,
      },
      DETAILED_BREAKDOWN: {
        monetaryObligations: monetaryCategoryItems.map((item: any) => ({
          categoryLabel: item.subject.subjectId,
          status: item.status,
          exactRate: item.exactValues?.rates?.[0] ?? null,
          monetaryValue: item.monetaryValues?.find((m: any) => m.role === 'FINAL_RESULT')?.money ?? null,
          decisionCode: item.decision.decisionCode,
        })),
        livestockObligations: livestockItems.map((item: any) => ({
          animalType: item.subject.subjectId,
          status: item.status,
          obligationPayload: item.authoritativePayload,
        })),
        agricultureObligations: agricultureItems.map((item: any) => ({
          produceType: item.subject.subjectId,
          status: item.status,
          obligationPayload: item.authoritativePayload,
        })),
      },
      EXCLUDED_AND_REVIEW_ITEMS: {
        notDueOrExempt: notDueItems.map((item: any) => ({
          categoryLabel: item.subject.subjectId,
          status: item.status,
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
        nisabStatus: nisabItems[0]?.status ?? 'REACHED',
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
