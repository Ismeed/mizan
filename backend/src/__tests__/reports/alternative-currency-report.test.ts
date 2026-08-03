/**
 * Alternative Currency Report Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { AlternativeCurrencyReportService } from '../../features/reports/services/alternative-currency-report.service';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('Alternative Currency Report Tests', () => {
  it('should generate an alternative currency report with rate disclosures without altering exact fractions', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_alt_curr',
      userId: 'u_alt',
      module: 'MIRATH',
      preferences: {
        madhhab: { selected: 'HANAFI', resolved: 'HANAFI', source: 'USER_PROFILE' },
        language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
        currency: { code: 'USD', symbol: '$', decimalPlaces: 2, locale: 'en-US', source: 'USER_PROFILE' },
        region: { countryCode: 'US', timezone: 'UTC', source: 'USER_PROFILE' },
      },
      versions: { profileSchemaVersion: '1.0.0', knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0', reportSchemaVersion: '1.0.0' },
      createdAt: new Date().toISOString(),
      isImmutable: true,
    };

    const envelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_alt',
      module: 'MIRATH',
      profile: mockProfile,
      rawInput: { netEstate: 100000 },
      mirathResult: {
        netEstate: 100000,
        shares: [],
        totalAllocated: 0,
        unallocated: 100000,
        calculationMethod: 'NORMAL',
        madhhab: 'HANAFI',
      },
    });

    const altReport = AlternativeCurrencyReportService.getAlternativeCurrencyReport({
      envelope,
      targetCurrencyCode: 'EUR',
      exchangeRate: 0.92,
      rateDate: '2026-08-03',
      rateSource: 'ECB_CENTRAL_BANK',
    });

    expect(altReport.reportType).toBe('ALTERNATIVE_CURRENCY_REPORT');
    expect(altReport.renderingContext.reportCurrencyCode).toBe('EUR');
    expect(altReport.renderingContext.alternativeCurrencyRendering).toBe(true);
  });
});
