/**
 * MIZAN — Digital Report Renderer (Phase 14)
 * Returns structured JSON payload formatted for mobile and web rich views.
 */

import type { StandardReportEnvelope } from '@mizan/shared';
import { ReportEvidenceService } from './report-evidence.service';
import { ReportExplanationService } from './report-explanation.service';

export class DigitalReportRenderer {
  static renderDigital(report: StandardReportEnvelope) {
    return {
      reportId: report.reportId,
      module: report.module,
      reportType: report.reportType,
      status: report.status,
      renderingContext: report.renderingContext,
      sections: report.sections.map((sec) => ({
        sectionId: sec.sectionId,
        sequence: sec.sequence,
        titleKey: sec.titleKey,
        contentBlocks: sec.contentBlocks,
        visibility: sec.visibility,
      })),
      evidence: ReportEvidenceService.formatReportEvidence(report as any),
      explanations: ReportExplanationService.formatReportExplanations(report as any),
      integrity: report.integrity,
    };
  }
}
