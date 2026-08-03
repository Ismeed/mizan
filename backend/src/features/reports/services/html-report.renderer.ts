/**
 * MIZAN — HTML Report Renderer (Phase 14)
 * Formats StandardReportEnvelope into structured HTML5.
 * Strictly consumes StandardReportEnvelope — NEVER recalculates logic.
 */

import type { StandardReportEnvelope } from '@mizan/shared';
import { ReportLocalizationService } from './report-localization.service';

export class HTMLReportRenderer {
  static renderHTML(report: StandardReportEnvelope): string {
    const isRtl = report.renderingContext.direction === 'RTL';
    const lang = report.renderingContext.languageTag;

    const sectionsHtml = report.sections
      .map((sec) => {
        const title = ReportLocalizationService.resolveSectionTitle(sec.sectionId, lang);
        const payload = sec.contentBlocks[0]?.payload ?? {};
        const payloadJson = JSON.stringify(payload, null, 2);

        return `
        <section class="report-section ${sec.sectionId.toLowerCase()}">
          <h2 class="section-title">${title}</h2>
          <div class="section-content">
            <pre class="payload-block">${payloadJson}</pre>
          </div>
        </section>
      `;
      })
      .join('\n');

    return `
<!DOCTYPE html>
<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>${report.module} Calculation Report — ${report.reportId}</title>
  <style>
    body {
      font-family: ${isRtl ? "'Amiri', 'Traditional Arabic', serif" : "'Helvetica Neue', Arial, sans-serif"};
      color: #1a1a1a;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
      background: #ffffff;
    }
    .report-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #d4af37;
      margin-bottom: 30px;
    }
    .report-header h1 {
      color: #0d3b2e;
      margin: 0;
      font-size: 28px;
    }
    .report-header p {
      color: #666;
      margin: 5px 0 0 0;
      font-size: 14px;
    }
    .section-title {
      color: #0d3b2e;
      border-bottom: 1px solid #d4af37;
      padding-bottom: 6px;
      margin-top: 30px;
      font-size: 18px;
    }
    .payload-block {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    .report-footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 11px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="report-header">
    <h1>MIZAN ${report.module} REPORT</h1>
    <p>Islamic Financial System — Standard Canonical Report</p>
    <p><strong>Report ID:</strong> ${report.reportId} | <strong>Madhhab:</strong> ${report.renderingContext.selectedMadhhab}</p>
  </div>

  <main class="report-body">
    ${sectionsHtml}
  </main>

  <div class="report-footer">
    <p>Checksum: ${report.integrity.reportChecksum} | Immutable MIZAN Report Snapshot</p>
  </div>
</body>
</html>
    `;
  }
}
