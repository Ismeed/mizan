/**
 * MIZAN — Safe Currency Utilities (Phase 12)
 */

import { MoneyValue } from '../types/currency/money.types';

export function formatCurrency(amount: number, currencyCode: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}

export function formatMoneyValue(money: MoneyValue, locale: string = 'en-US'): string {
  const decimalAmountNum = parseFloat(money.decimalAmount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currencyCode.toUpperCase(),
    minimumFractionDigits: money.minorUnitDigits,
    maximumFractionDigits: money.minorUnitDigits,
  }).format(decimalAmountNum);
}
