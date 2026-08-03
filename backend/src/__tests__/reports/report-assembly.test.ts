/**
 * Report Assembly Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';
import { ReportAssemblyService } from '../../features/reports/services/report-assembly.service';

describe('Report Assembly Tests', () => {
  const mockProfile: any = {
    calculationProfileId: 'prof_test_asm',
    userId: 'u_asm',
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

  it('should assemble a StandardReportEnvelope exclusively from a CalculationResultEnvelope', () => {
    const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_asm_1',
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

    const report = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });

    expect(report.reportId).toBeDefined();
    expect(report.sections.length).toBe(12);
    expect(report.source.resultId).toBe(calcEnvelope.resultId);
    expect(report.integrity.reportChecksum).toBeDefined();
  });
});
