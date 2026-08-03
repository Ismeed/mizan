/**
 * CLI Command — Test Mirath Report Generation (Phase 14)
 * Usage: npm run reports:test-mirath
 */

import { ReportAssemblyService } from '../../src/features/reports/services/report-assembly.service';
import { CalculationResultAssemblerService } from '../../src/features/results/services/calculation-result-assembler.service';

function main() {
  console.log('🧪 Testing Mirath Report Assembly...');

  const mockProfile: any = {
    calculationProfileId: 'prof_m_rep',
    userId: 'u_m',
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

  const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
    calculationId: 'calc_m_test',
    module: 'MIRATH',
    profile: mockProfile,
    rawInput: { netEstate: 500000 },
    mirathResult: {
      netEstate: 500000,
      shares: [
        {
          key: 'husband',
          label: 'Husband',
          count: 1,
          shareType: 'FARD',
          fractionLabel: '1/2',
          fractionNumerator: 1,
          fractionDenominator: 2,
          shareOfEstate: 0.5,
          totalAmount: 250000,
          perPersonAmount: 250000,
          isBlocked: false,
        },
      ],
      totalAllocated: 250000,
      unallocated: 250000,
      calculationMethod: 'NORMAL',
      madhhab: 'HANAFI',
    },
  });

  const report = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });
  console.log(`✅ Mirath Report Assembled Successfully (${report.sections.length} sections)`);
  console.log(`   Report ID: ${report.reportId}`);
  console.log(`   Status: ${report.status}`);
}

main();
