/**
 * Zakat Result Contract Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { ZakatResultAssemblerService } from '../../features/results/services/zakat-result-assembler.service';

describe('Zakat Result Contract Tests', () => {
  it('should format Zakat calculation output with exact rational rate 1/40 and exact monetary minor units', () => {
    const zakatResult: any = {
      isDue: true,
      hawlMet: true,
      totalZakatableWealth: 5000000,
      totalLiabilities: 0,
      netZakatableWealth: 5000000,
      nisabThreshold: 1000000,
      zakatDue: 125000,
      zakatRate: 0.025,
      breakdown: [{ name: 'Cash', value: 5000000, isZakatable: true }],
    };

    const assembled = ZakatResultAssemblerService.assembleZakatResult({
      zakatResult,
      currencyCode: 'NGN',
      calculationId: 'calc_zakat_test',
    });

    const catItem = assembled.resultItems.find((i) => i.itemType === 'ZAKAT_CATEGORY_RESULT');
    expect(catItem).toBeDefined();
    expect(catItem?.status).toBe('OBLIGATION_DUE');
    expect(catItem?.exactValues.rates[0].numerator).toBe(1);
    expect(catItem?.exactValues.rates[0].denominator).toBe(40);
    expect(catItem?.monetaryValues.find((m) => m.role === 'FINAL_RESULT')?.money.amountMinor).toBe('12500000');
  });
});
