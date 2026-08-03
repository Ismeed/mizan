/**
 * Money Input Parser Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Safe parsing of user monetary input across locales without `parseFloat`.
 * Supports Eastern Arabic numerals, locale decimal separators, and strict format checking.
 */

import Decimal from 'decimal.js';
import { MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

export class MoneyInputParserService {
  /**
   * Eastern Arabic to Western ASCII digit mapping
   */
  private static ARABIC_DIGIT_MAP: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٫': '.', // Arabic decimal separator
    '٬': '',  // Arabic thousands separator
  };

  /**
   * Normalize input string by converting digits and removing thousands separators.
   */
  public static normalizeInput(rawInput: string, locale: string = 'en-US'): string {
    if (!rawInput) return '0';

    let str = rawInput.trim();

    // Convert Eastern Arabic digits
    str = str.replace(/[٠-٩٫٬]/g, (ch) => this.ARABIC_DIGIT_MAP[ch] ?? ch);

    // If comma is used as decimal separator (e.g. European/fr locales "1.250,50")
    if (locale.startsWith('fr') || locale.startsWith('de') || locale.includes('-DE') || locale.includes('-FR')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // English/Standard: remove commas as thousands separators
      str = str.replace(/,/g, '');
    }

    return str;
  }

  /**
   * Parse raw monetary string into a canonical MoneyValue.
   */
  public static parseMoneyInput(
    rawInput: string,
    currencyCode: string,
    locale: string = 'en-US'
  ): MoneyValue {
    const normalized = this.normalizeInput(rawInput, locale);

    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
      throw new Error(`MALFORMED_MONETARY_INPUT: Input '${rawInput}' cannot be parsed into a valid decimal amount`);
    }

    try {
      const dec = new Decimal(normalized);
      if (dec.isNegative()) {
        throw new Error('NEGATIVE_AMOUNT_PROHIBITED: Monetary amounts cannot be negative for calculation inputs');
      }
      return MoneyArithmeticService.createMoney(dec.toString(), currencyCode);
    } catch (err: any) {
      if (err.message.includes('PROHIBITED')) throw err;
      throw new Error(`MONEY_PARSING_FAILED: Invalid amount '${rawInput}'`);
    }
  }
}
