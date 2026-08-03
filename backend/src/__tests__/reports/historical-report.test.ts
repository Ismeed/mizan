/**
 * Historical Report Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { HistoricalReportService } from '../../features/reports/services/historical-report.service';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('Historical Report Tests', () => {
  it('should generate a historical report preserving original envelope without recalculating', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_hist',
      userId: 'u_hist',
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
      calculationId: 'calc_hist',
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

    const historicalReport = HistoricalReportService.getHistoricalReport(envelope);

    expect(historicalReport.reportType).toBe('HISTORICAL_REPORT');
    expect(historicalReport.renderingContext.historicalRendering).toBe(true);
  });
});
