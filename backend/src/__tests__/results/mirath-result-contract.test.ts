/**
 * Mirath Result Contract Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { MirathResultAssemblerService } from '../../features/results/services/mirath-result-assembler.service';
import type { MirathResult } from '@mizan/shared';

describe('Mirath Result Contract Tests', () => {
  it('should format blocked heirs with BLOCKED status and zero monetary allocation', () => {
    const mirathResult: MirathResult = {
      netEstate: 1000000,
      shares: [
        {
          key: 'sons',
          label: 'Son',
          count: 1,
          shareType: 'ASABAH',
          fractionLabel: 'Residue',
          fractionNumerator: 1,
          fractionDenominator: 1,
          shareOfEstate: 1,
          totalAmount: 1000000,
          perPersonAmount: 1000000,
          isBlocked: false,
        },
        {
          key: 'paternalGrandfathers',
          label: 'Paternal Grandfather',
          count: 1,
          shareType: 'BLOCKED',
          fractionLabel: 'Blocked',
          fractionNumerator: 0,
          fractionDenominator: 1,
          shareOfEstate: 0,
          totalAmount: 0,
          perPersonAmount: 0,
          isBlocked: true,
          blockingReason: 'Blocked by Son',
        },
      ],
      totalAllocated: 1000000,
      unallocated: 0,
      calculationMethod: 'NORMAL',
      madhhab: 'HANAFI',
    };

    const assembled = MirathResultAssemblerService.assembleMirathResult({
      mirathResult,
      netEstateAmount: 1000000,
      currencyCode: 'USD',
      calculationId: 'calc_mirath_test',
    });

    const blockedItem = assembled.resultItems.find((i) => i.subject.subjectId === 'PATERNALGRANDFATHERS');
    expect(blockedItem).toBeDefined();
    expect(blockedItem?.status).toBe('BLOCKED');
    expect(blockedItem?.monetaryValues[0].money.amountMinor).toBe('0');
  });
});
