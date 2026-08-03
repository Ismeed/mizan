/**
 * MIZAN — PDF Report Renderer (Phase 14)
 * Uses Puppeteer to convert StandardReportEnvelope HTML rendering into A4 PDF Buffer.
 * Strictly consumes StandardReportEnvelope — NEVER recalculates logic.
 */

import type { StandardReportEnvelope } from '@mizan/shared';
import { HTMLReportRenderer } from './html-report.renderer';

export class PDFReportRenderer {
  static async renderPDF(report: StandardReportEnvelope): Promise<Buffer> {
    const html = HTMLReportRenderer.renderHTML(report);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
