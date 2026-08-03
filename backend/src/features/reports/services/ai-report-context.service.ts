/**
 * MIZAN — AI Report Context Service (Phase 14)
 * Packages report envelope data for AI explanation with 8 strict AI restrictions.
 */

import type { StandardReportEnvelope } from '@mizan/shared';

export interface AIReportContextPackage {
  task: 'EXPLAIN_REPORT_SECTION';
  reportContext: {
    reportId: string;
    reportType: string;
    calculationId: string;
    resultId: string;
    module: string;
    selectedMadhhab: string;
    languageTag: string;
  };
  approvedReportContext: {
    sections: Array<{ sectionId: string; titleKey: string }>;
    evidenceCount: number;
    warningsCount: number;
  };
  restrictions: {
    mustNotRecalculate: boolean;
    mustNotChangeReport: boolean;
    mustNotChangeResult: boolean;
    mustNotChangeMadhhab: boolean;
    mustNotInventEvidence: boolean;
    mustNotInventFraction: boolean;
    mustNotInventRate: boolean;
    mustNotPresentGeneratedTextAsSourceText: boolean;
  };
}

export class AIReportContextService {
  static buildReportAIContext(report: StandardReportEnvelope, sectionId?: string): AIReportContextPackage {
    return {
      task: 'EXPLAIN_REPORT_SECTION',
      reportContext: {
        reportId: report.reportId,
        reportType: report.reportType,
        calculationId: report.source.calculationId,
        resultId: report.source.resultId,
        module: report.module,
        selectedMadhhab: report.renderingContext.selectedMadhhab,
        languageTag: report.renderingContext.languageTag,
      },
      approvedReportContext: {
        sections: report.sections.map((s) => ({ sectionId: s.sectionId, titleKey: s.titleKey })),
        evidenceCount: report.sections.reduce((acc, s) => acc + s.evidenceIds.length, 0),
        warningsCount: report.sections.reduce((acc, s) => acc + s.warnings.length, 0),
      },
      restrictions: {
        mustNotRecalculate: true,
        mustNotChangeReport: true,
        mustNotChangeResult: true,
        mustNotChangeMadhhab: true,
        mustNotInventEvidence: true,
        mustNotInventFraction: true,
        mustNotInventRate: true,
        mustNotPresentGeneratedTextAsSourceText: true,
      },
    };
  }
}
