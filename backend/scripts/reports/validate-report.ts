/**
 * CLI Command — Validate Standard Report Contract (Phase 14)
 * Usage: npm run reports:validate
 */

import { ReportAssemblyService } from '../../src/features/reports/services/report-assembly.service';
import { ReportValidationService } from '../../src/features/reports/services/report-validation.service';
import { CalculationResultAssemblerService } from '../../src/features/results/services/calculation-result-assembler.service';

function main() {
  console.log('🔍 MIZAN Report Architecture Validation Tool');

  const mockProfile: any = {
    calculationProfileId: 'prof_rep_1',
    userId: 'user_rep',
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

  const mockMirathResult: any = {
    netEstate: 1000000,
    shares: [
      {
        key: 'wives',
        label: 'Wife',
        count: 1,
        shareType: 'FARD',
        fractionLabel: '1/8',
        fractionNumerator: 1,
        fractionDenominator: 8,
        shareOfEstate: 0.125,
        totalAmount: 125000,
        perPersonAmount: 125000,
        isBlocked: false,
      },
    ],
    totalAllocated: 125000,
    unallocated: 875000,
    calculationMethod: 'NORMAL',
    madhhab: 'HANAFI',
  };

  const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
    calculationId: 'calc_rep_val',
    module: 'MIRATH',
    profile: mockProfile,
    rawInput: { netEstate: 1000000 },
    mirathResult: mockMirathResult,
  });

  const reportEnvelope = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });
  const validation = ReportValidationService.validateReport(reportEnvelope);

  if (validation.isValid) {
    console.log('✅ Standard Report Envelope Contract Validation PASSED');
    console.log(`   Report ID: ${reportEnvelope.reportId}`);
    console.log(`   Sections: ${reportEnvelope.sections.length} (12 standard sequence)`);
    console.log(`   Checksum: ${reportEnvelope.integrity.reportChecksum}`);
    process.exit(0);
  } else {
    console.error('❌ Standard Report Envelope Contract Validation FAILED');
    console.error(validation.errors);
    process.exit(1);
  }
}

main();
