/**
 * Money Formatting Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Locale-aware monetary presentation formatting.
 * Never mutates stored MoneyValue.
 */

import { MoneyValue } from '@mizan/shared';
import { CurrencyRegistryService } from './currency-registry.service';

export type MoneyDisplayMode =
  | 'COMPACT'
  | 'STANDARD'
  | 'ACCOUNTING'
  | 'REPORT'
  | 'ACCESSIBILITY';

export class MoneyFormattingService {
  /**
   * Currencies sharing common symbols (e.g. '$') requiring code prefix for disambiguation
   */
  private static AMBIGUOUS_SYMBOLS: Set<string> = new Set(['$', '£', '¥', '元', 'kr']);

  public static formatMoney(
    money: MoneyValue,
    locale: string = 'en-US',
    displayMode: MoneyDisplayMode = 'STANDARD'
  ): string {
    const currency = CurrencyRegistryService.getCurrency(money.currencyCode);
    const symbol = currency ? currency.symbolMetadata.defaultSymbol : money.currencyCode;
    const decimalAmountNum = parseFloat(money.decimalAmount);

    if (displayMode === 'COMPACT') {
      const compactFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: money.currencyCode,
        notation: 'compact',
        maximumFractionDigits: 2,
      });
      return compactFormatter.format(decimalAmountNum);
    }

    if (displayMode === 'ACCOUNTING') {
      const isNegative = decimalAmountNum < 0;
      const absAmount = Math.abs(decimalAmountNum);
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: money.minorUnitDigits,
        maximumFractionDigits: money.minorUnitDigits,
      }).format(absAmount);

      return isNegative ? `(${symbol}${formatted})` : `${symbol}${formatted}`;
    }

    if (displayMode === 'ACCESSIBILITY') {
      const localizedName = CurrencyRegistryService.resolveLocalizedName(
        money.currencyCode,
        locale.split('-')[0] || 'en',
        Math.abs(decimalAmountNum) !== 1
      );
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: money.minorUnitDigits,
        maximumFractionDigits: money.minorUnitDigits,
      }).format(decimalAmountNum);

      return `${formatted} ${localizedName}`;
    }

    // STANDARD and REPORT modes
    const standardFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currencyCode,
      minimumFractionDigits: money.minorUnitDigits,
      maximumFractionDigits: money.minorUnitDigits,
    });

    const formatted = standardFormatter.format(decimalAmountNum);

    // Disambiguate if symbol is shared across multiple currencies
    if (this.AMBIGUOUS_SYMBOLS.has(symbol) && !formatted.includes(money.currencyCode)) {
      return `${money.currencyCode} ${formatted}`;
    }

    return formatted;
  }
}
