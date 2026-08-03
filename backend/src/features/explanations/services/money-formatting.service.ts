/**
 * Money Formatting Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { LanguageRegistryService } from './language-registry.service';

export class MoneyFormattingService {
  public static formatMoney(
    amount: number | string,
    currencyCode: string = 'NGN',
    localeTag: string = 'en-NG'
  ): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return `${currencyCode} 0.00`;

    const localeRecord = LanguageRegistryService.getLocale(localeTag) || LanguageRegistryService.getLocale('en-NG')!;
    
    const currencySymbols: Record<string, string> = {
      NGN: '₦',
      USD: '$',
      GBP: '£',
      EUR: '€',
      SAR: 'ر.س',
      AED: 'د.إ',
    };

    const symbol = currencySymbols[currencyCode] || `${currencyCode} `;
    
    const parts = numAmount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, localeRecord.numberGroupingSeparator);
    const formattedNum = parts.join(localeRecord.decimalSeparator);

    return `${symbol}${formattedNum}`;
  }
}
