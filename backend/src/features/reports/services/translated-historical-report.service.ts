/**
 * MIZAN — Translated Historical Report Service (Phase 14)
 * Renders an existing historical calculation result in a new language while preserving exact Islamic rulings.
 * Labelled TRANSLATED_HISTORICAL_REPORT.
 */

import type { CalculationResultEnvelope, StandardReportEnvelope } from '@mizan/shared';
import { ReportAssemblyService } from './report-assembly.service';

export class TranslatedHistoricalReportService {
  static getTranslatedReport(
    envelope: CalculationResultEnvelope,
    targetLanguageTag: string,
    targetLocale: string,
    direction: 'LTR' | 'RTL' = 'LTR'
  ): StandardReportEnvelope {
    return ReportAssemblyService.assembleReport({
      envelope,
      reportType: 'TRANSLATED_HISTORICAL_REPORT',
      renderingContext: {
        languageTag: targetLanguageTag,
        locale: targetLocale,
        direction,
        historicalRendering: true,
      },
    });
  }
}
