/**
 * MIZAN — Print Report Renderer (Phase 14)
 * Formats report for physical print dialogs with high-contrast grayscale policies.
 */

import type { StandardReportEnvelope } from '@mizan/shared';
import { HTMLReportRenderer } from './html-report.renderer';

export class PrintReportRenderer {
  static renderPrintHTML(report: StandardReportEnvelope): string {
    const html = HTMLReportRenderer.renderHTML(report);
    return html.replace('</head>', '<style>@media print { body { font-size: 11pt; padding: 0; } }</style></head>');
  }
}
