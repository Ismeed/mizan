/**
 * CLI Command — Test Zakat Report Generation (Phase 14)
 * Usage: npm run reports:test-zakat
 */

import { ReportAssemblyService } from '../../src/features/reports/services/report-assembly.service';
import { CalculationResultAssemblerService } from '../../src/features/results/services/calculation-result-assembler.service';

function main() {
  console.log('🧪 Testing Zakat Report Assembly...');

  const mockProfile: any = {
    calculationProfileId: 'prof_z_rep',
    userId: 'u_z',
    module: 'ZAKAT',
    preferences: {
      madhhab: { selected: 'MALIKI', resolved: 'MALIKI', source: 'USER_PROFILE' },
      language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
      currency: { code: 'NGN', symbol: '₦', decimalPlaces: 2, locale: 'en-NG', source: 'USER_PROFILE' },
      region: { countryCode: 'NG', timezone: 'Africa/Lagos', source: 'USER_PROFILE' },
    },
    versions: { profileSchemaVersion: '1.0.0', knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0', reportSchemaVersion: '1.0.0' },
    createdAt: new Date().toISOString(),
    isImmutable: true,
  };

  const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
    calculationId: 'calc_z_test',
    module: 'ZAKAT',
    profile: mockProfile,
    rawInput: { netZakatableWealth: 10000000 },
    zakatResult: {
      isDue: true,
      hawlMet: true,
      totalZakatableWealth: 10000000,
      totalLiabilities: 0,
      netZakatableWealth: 10000000,
      nisabThreshold: 1000000,
      zakatDue: 250000,
      zakatRate: 0.025,
      breakdown: [{ name: 'Cash and Savings', value: 10000000, isZakatable: true }],
    },
  });

  const report = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });
  console.log(`✅ Zakat Report Assembled Successfully (${report.sections.length} sections)`);
  console.log(`   Report ID: ${report.reportId}`);
  console.log(`   Status: ${report.status}`);
}

main();
