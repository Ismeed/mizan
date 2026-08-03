/**
 * Currency Conversion Test Suite
 * Phase 12 — MIZAN Currency Architecture
 */

import { CurrencyConversionService } from '../../features/currency/services/currency-conversion.service';
import { ExchangeRateSnapshotService } from '../../features/currency/services/exchange-rate-snapshot.service';
import { MoneyArithmeticService } from '../../features/currency/services/money-arithmetic.service';

describe('Currency Conversion Tests', () => {
  beforeAll(() => {
    // Seed approved rate snapshot: 1 USD = 1500.00 NGN
    ExchangeRateSnapshotService.createSnapshot({
      sourceCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rateValue: '1500.00000000',
      rateDate: '2026-08-01',
      providerId: 'CENTRAL_BANK_NIGERIA',
    });
  });

  it('should convert USD to NGN using approved snapshot', () => {
    const usdMoney = MoneyArithmeticService.createMoney('100.00', 'USD');

    const result = CurrencyConversionService.convertMoney({
      conversionRequestId: 'REQ-001',
      sourceMoney: usdMoney,
      targetCurrencyCode: 'NGN',
      valuationDate: '2026-08-01',
      conversionPurpose: 'ESTATE_CONSOLIDATION',
      requestedAt: new Date().toISOString(),
    });

    expect(result.targetMoney.currencyCode).toBe('NGN');
    expect(result.targetMoney.decimalAmount).toBe('150000.00');
    expect(result.targetMoney.amountMinor).toBe('15000000');
  });

  it('should return identity conversion when converting same currency', () => {
    const ngnMoney = MoneyArithmeticService.createMoney('5000.00', 'NGN');

    const result = CurrencyConversionService.convertMoney({
      conversionRequestId: 'REQ-002',
      sourceMoney: ngnMoney,
      targetCurrencyCode: 'NGN',
      valuationDate: '2026-08-01',
      conversionPurpose: 'REPORT_RENDERING',
      requestedAt: new Date().toISOString(),
    });

    expect(result.targetMoney.decimalAmount).toBe('5000.00');
  });

  it('should throw EXCHANGE_RATE_UNAVAILABLE when no approved snapshot exists', () => {
    const ghsMoney = MoneyArithmeticService.createMoney('1000.00', 'GHS');

    expect(() =>
      CurrencyConversionService.convertMoney({
        conversionRequestId: 'REQ-003',
        sourceMoney: ghsMoney,
        targetCurrencyCode: 'KES',
        valuationDate: '2026-08-01',
        conversionPurpose: 'REPORT_RENDERING',
        requestedAt: new Date().toISOString(),
      })
    ).toThrow(/No approved exchange rate available/);
  });
});
