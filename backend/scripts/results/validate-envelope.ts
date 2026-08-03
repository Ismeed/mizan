/**
 * CLI Validation Command — Validate Result Envelope Contracts (Phase 13)
 * Usage: npm run results:validate
 */

import { CalculationResultAssemblerService } from '../../src/features/results/services/calculation-result-assembler.service';
import { CalculationResultValidationService } from '../../src/features/results/services/calculation-result-validation.service';
import type { CalculationProfile, MirathResult } from '@mizan/shared';

function main() {
  console.log('🔍 MIZAN Result Contract Validation Tool');

  const mockProfile: CalculationProfile = {
    calculationProfileId: 'cli_prof_1',
    userId: 'user_cli',
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
    checksum: 'chk_cli',
  };

  const mockMirathResult: MirathResult = {
    netEstate: 500000,
    shares: [
      {
        key: 'wives',
        label: 'Wife',
        count: 1,
        shareType: 'FARD',
        fractionLabel: '1/4',
        fractionNumerator: 1,
        fractionDenominator: 4,
        shareOfEstate: 0.25,
        totalAmount: 125000,
        perPersonAmount: 125000,
        isBlocked: false,
      },
    ],
    totalAllocated: 125000,
    unallocated: 375000,
    calculationMethod: 'NORMAL',
    madhhab: 'HANAFI',
  };

  const envelope = CalculationResultAssemblerService.assembleEnvelope({
    calculationId: 'cli_calc_1',
    module: 'MIRATH',
    profile: mockProfile,
    rawInput: { netEstate: 500000 },
    mirathResult: mockMirathResult,
  });

  const validation = CalculationResultValidationService.validateEnvelope(envelope);

  if (validation.isValid) {
    console.log('✅ Result Envelope Contract Validation PASSED');
    console.log(`   Result ID: ${envelope.resultId}`);
    console.log(`   Module: ${envelope.module}`);
    console.log(`   Status: ${envelope.status}`);
    console.log(`   Items: ${envelope.resultItems.length}`);
    console.log(`   Checksum: ${envelope.integrity.resultChecksum}`);
    process.exit(0);
  } else {
    console.error('❌ Result Envelope Contract Validation FAILED');
    console.error(validation.errors);
    process.exit(1);
  }
}

main();
