/**
 * Agriculture Result Contract Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { AgricultureResultAssemblerService } from '../../features/results/services/agriculture-result-assembler.service';

describe('Agriculture Result Contract Tests', () => {
  it('should assemble a physical agriculture obligation item with exact rate 1/10 and physical harvest quantities', () => {
    const item = AgricultureResultAssemblerService.assembleAgricultureResult({
      produceTypeId: 'WHEAT',
      harvestGroupId: 'HG-WHEAT-2026',
      nisabStatus: 'REACHED',
      irrigationClassification: 'RAIN_FED',
      rateNumerator: 1,
      rateDenominator: 10,
      harvestQuantityKg: 2000,
      obligationQuantityKg: 200,
    });

    expect(item.itemType).toBe('AGRICULTURE_OBLIGATION_RESULT');
    expect(item.status).toBe('PHYSICAL_OBLIGATION_DUE');
    expect(item.exactValues.rates[0].numerator).toBe(1);
    expect(item.exactValues.rates[0].denominator).toBe(10);
    expect(item.exactValues.quantities.find((q) => q.valueId === 'PHYSICAL_OBLIGATION')?.value).toBe('200');
  });
});
