/**
 * Result Item Factory Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { ResultItemFactoryService } from '../../features/results/services/result-item-factory.service';

describe('Result Item Factory Tests', () => {
  it('should create a valid ResultItem with exact values, monetary values, and integrity checksum', () => {
    const item = ResultItemFactoryService.createResultItem({
      itemType: 'FIXED_SHARE_RESULT',
      subject: {
        subjectType: 'HEIR',
        subjectId: 'WIFE',
        subjectVersion: '1.0.0',
        instanceId: 'heir_inst_1',
      },
      status: 'SHARE_ASSIGNED',
      decisionCode: 'MIRATH_FIXED_SHARE_ASSIGNED',
      decisionType: 'FIXED_SHARE',
      authoritativePayload: { count: 1 },
      exactValues: {
        fractions: [{ valueId: 'SHARE', numerator: 1, denominator: 8 }],
      },
      monetaryValues: [
        {
          valueId: 'ALLOCATION',
          role: 'FINAL_RESULT',
          money: {
            currencyCode: 'NGN',
            representationType: 'MINOR_UNITS',
            amountMinor: '12500000',
            decimalAmount: '125000.00',
            minorUnitDigits: 2,
          },
        },
      ],
    });

    expect(item.resultItemId).toBeDefined();
    expect(item.itemType).toBe('FIXED_SHARE_RESULT');
    expect(item.subject.subjectId).toBe('WIFE');
    expect(item.exactValues.fractions[0].numerator).toBe(1);
    expect(item.exactValues.fractions[0].denominator).toBe(8);
    expect(item.integrity.itemChecksum).toBeDefined();
  });
});
