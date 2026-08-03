/**
 * MIZAN — Currency Report Content Adapter (Phase 14)
 * Formats monetary amounts with mandatory conversion disclosures when report currency differs from calculation currency.
 */

import type { MoneyValue } from '@mizan/shared';

export class CurrencyReportContentAdapter {
  static formatMoney(
    money: MoneyValue,
    reportCurrency?: string,
    exchangeRateSnapshot?: { rate: number; rateDate: string } | null
  ) {
    const isConverted = reportCurrency && reportCurrency !== money.currencyCode;
    const decimalVal = Number(money.decimalAmount);

    if (isConverted && exchangeRateSnapshot) {
      const convertedDecimal = (decimalVal * exchangeRateSnapshot.rate).toFixed(2);
      return {
        originalCurrency: money.currencyCode,
        originalAmount: money.decimalAmount,
        reportCurrency,
        convertedAmount: convertedDecimal,
        exchangeRate: exchangeRateSnapshot.rate,
        rateDate: exchangeRateSnapshot.rateDate,
        isConverted: true,
        disclosure: `Converted from ${money.currencyCode} to ${reportCurrency} at rate ${exchangeRateSnapshot.rate} on ${exchangeRateSnapshot.rateDate}. Religious shares & exact ratios remain unchanged.`,
      };
    }

    return {
      currencyCode: money.currencyCode,
      amount: money.decimalAmount,
      isConverted: false,
    };
  }
}
