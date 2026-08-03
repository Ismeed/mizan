/**
 * Report Validation Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { ReportAssemblyService } from '../../features/reports/services/report-assembly.service';
import { ReportValidationService } from '../../features/reports/services/report-validation.service';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('Report Validation Tests', () => {
  it('should validate report envelope structure and canonical section order', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_val',
      userId: 'u_val',
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
      calculationId: 'calc_val',
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

    const report = ReportAssemblyService.assembleReport({ envelope });
    const validation = ReportValidationService.validateReport(report);

    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });
});
