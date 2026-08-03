/**
 * Calculation Result Envelope Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';
import { CalculationResultValidationService } from '../../features/results/services/calculation-result-validation.service';
import type { CalculationProfile, MirathResult } from '@mizan/shared';

describe('Calculation Result Envelope Tests', () => {
  const mockProfile: CalculationProfile = {
    calculationProfileId: 'prof_123',
    userId: 'user_123',
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
    checksum: 'chk123',
  };

  const mockMirathResult: MirathResult = {
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

  it('should assemble a valid canonical CalculationResultEnvelope', () => {
    const envelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_123',
      module: 'MIRATH',
      profile: mockProfile,
      rawInput: { totalEstate: 1000000 },
      mirathResult: mockMirathResult,
    });

    expect(envelope.resultId).toBeDefined();
    expect(envelope.calculationId).toBe('calc_123');
    expect(envelope.module).toBe('MIRATH');
    expect(envelope.status).toBe('COMPLETED');
    expect(envelope.resultItems.length).toBeGreaterThan(0);
    expect(envelope.integrity.resultChecksum).toBeDefined();

    const validation = CalculationResultValidationService.validateEnvelope(envelope);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });
});
