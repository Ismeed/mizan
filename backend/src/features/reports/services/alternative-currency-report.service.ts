/**
 * MIZAN — Alternative Currency Report Service (Phase 14)
 * Renders an existing calculation result in an alternative reporting currency with conversion disclosures.
 * Labelled ALTERNATIVE_CURRENCY_REPORT.
 */

import type { CalculationResultEnvelope, StandardReportEnvelope } from '@mizan/shared';
import { ReportAssemblyService } from './report-assembly.service';

export interface AlternativeCurrencyOptions {
  envelope: CalculationResultEnvelope;
  targetCurrencyCode: string;
  exchangeRate: number;
  rateDate: string;
  rateSource: string;
}

export class AlternativeCurrencyReportService {
  static getAlternativeCurrencyReport(options: AlternativeCurrencyOptions): StandardReportEnvelope {
    const { envelope, targetCurrencyCode, exchangeRate, rateDate, rateSource } = options;

    return ReportAssemblyService.assembleReport({
      envelope,
      reportType: 'ALTERNATIVE_CURRENCY_REPORT',
      renderingContext: {
        reportCurrencyCode: targetCurrencyCode,
        alternativeCurrencyRendering: true,
        exchangeRateSnapshot: {
          fromCurrency: envelope.profile.currency.calculationCurrencyCode,
          toCurrency: targetCurrencyCode,
          rate: exchangeRate,
          rateDate,
          rateSource,
        },
      },
    });
  }
}
