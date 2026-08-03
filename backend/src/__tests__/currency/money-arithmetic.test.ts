/**
 * Money Arithmetic Test Suite
 * Phase 12 — MIZAN Currency Architecture
 */

import { MoneyArithmeticService } from '../../features/currency/services/money-arithmetic.service';

describe('Money Arithmetic Tests', () => {
  it('should create MoneyValue objects accurately without floating-point drift', () => {
    const money = MoneyArithmeticService.createMoney('2500000.50', 'NGN');
    expect(money.currencyCode).toBe('NGN');
    expect(money.amountMinor).toBe('250000050');
    expect(money.decimalAmount).toBe('2500000.50');
  });

  it('should perform same-currency addition correctly', () => {
    const m1 = MoneyArithmeticService.createMoney('1000.25', 'USD');
    const m2 = MoneyArithmeticService.createMoney('500.75', 'USD');
    const sum = MoneyArithmeticService.add(m1, m2);

    expect(sum.currencyCode).toBe('USD');
    expect(sum.decimalAmount).toBe('1501.00');
    expect(sum.amountMinor).toBe('150100');
  });

  it('should throw error when adding different currencies without conversion', () => {
    const m1 = MoneyArithmeticService.createMoney('1000.00', 'NGN');
    const m2 = MoneyArithmeticService.createMoney('100.00', 'USD');

    expect(() => MoneyArithmeticService.add(m1, m2)).toThrow(/CURRENCY_MISMATCH_ADDITION/);
  });

  it('should multiply MoneyValue by exact Islamic fraction (1/8)', () => {
    const estate = MoneyArithmeticService.createMoney('1000000.00', 'NGN');
    const fraction = { numerator: 1, denominator: 8 };

    const { unroundedDecimal, roundedMoney } = MoneyArithmeticService.multiplyByFraction(estate, fraction);

    expect(unroundedDecimal).toBe('125000');
    expect(roundedMoney.decimalAmount).toBe('125000.00');
    expect(roundedMoney.amountMinor).toBe('12500000');
  });
});
