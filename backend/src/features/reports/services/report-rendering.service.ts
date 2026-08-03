/**
 * MIZAN — Report Rendering Facade Service (Phase 14)
 * Orchestrates: Assembly -> Validation -> Localization -> Format Rendering -> Snapshotting.
 */

import type { CalculationResultEnvelope, StandardReportEnvelope, ReportType } from '@mizan/shared';
import { ReportAssemblyService } from './report-assembly.service';
import { ReportValidationService } from './report-validation.service';
import { ReportSnapshotService } from './report-snapshot.service';
import { HTMLReportRenderer } from './html-report.renderer';
import { PDFReportRenderer } from './pdf-report.renderer';
import { DigitalReportRenderer } from './digital-report.renderer';
import { ResultIntegrityService } from '../../results/services/result-integrity.service';

export interface GenerateReportOptions {
  envelope: CalculationResultEnvelope;
  reportType?: ReportType;
  format?: 'DIGITAL' | 'PDF' | 'HTML';
  languageTag?: string;
  reportCurrencyCode?: string;
}

export class ReportRenderingService {
  static async generateReport(options: GenerateReportOptions): Promise<{
    report: StandardReportEnvelope;
    renderedOutput: any;
    snapshot: any;
  }> {
    const report = ReportAssemblyService.assembleReport({
      envelope: options.envelope,
      reportType: options.reportType ?? 'DETAILED_REPORT',
      renderingContext: {
        format: options.format ?? 'PDF',
        languageTag: options.languageTag,
        reportCurrencyCode: options.reportCurrencyCode,
      },
    });

    const validation = ReportValidationService.validateReport(report);
    if (!validation.isValid) {
      throw new Error(`REPORT_VALIDATION_FAILED: ${JSON.stringify(validation.errors)}`);
    }

    let renderedOutput: any;
    let renderedChecksum = '';

    if (options.format === 'PDF') {
      const pdfBuffer = await PDFReportRenderer.renderPDF(report);
      renderedOutput = pdfBuffer;
      renderedChecksum = ResultIntegrityService.generateChecksum(pdfBuffer.toString('base64'));
    } else if (options.format === 'HTML') {
      const html = HTMLReportRenderer.renderHTML(report);
      renderedOutput = html;
      renderedChecksum = ResultIntegrityService.generateChecksum(html);
    } else {
      const digital = DigitalReportRenderer.renderDigital(report);
      renderedOutput = digital;
      renderedChecksum = ResultIntegrityService.generateChecksum(digital);
    }

    const snapshot = ReportSnapshotService.createSnapshot(report, renderedChecksum);

    return {
      report,
      renderedOutput,
      snapshot,
    };
  }
}
