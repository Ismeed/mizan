/**
 * Money Arithmetic Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * CRITICAL ARCHITECTURAL CONSTRAINTS:
 * - NEVER use IEEE-754 binary floating-point (`number` / `parseFloat`) for financial arithmetic
 * - Perform all arithmetic using Decimal (decimal.js)
 * - Same-currency guards enforced on addition and subtraction
 * - Multiplication by exact fraction preserves integer/rational precision
 */

import Decimal from 'decimal.js';
import { Fraction, MoneyValue } from '@mizan/shared';
import { CurrencyRegistryService } from './currency-registry.service';

export class MoneyArithmeticService {
  /**
   * Create a MoneyValue object from a decimal string and currency code.
   */
  public static createMoney(decimalString: string, currencyCode: string): MoneyValue {
    const code = currencyCode.toUpperCase();
    const currency = CurrencyRegistryService.getCurrency(code);
    const minorUnitDigits = currency ? currency.precision.minorUnitDigits : 2;

    const dec = new Decimal(decimalString);
    const factor = new Decimal(10).pow(minorUnitDigits);
    const amountMinor = dec.mul(factor).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toString();
    const decimalAmount = dec.toFixed(minorUnitDigits);

    return {
      currencyCode: code,
      representationType: 'MINOR_UNITS',
      amountMinor,
      decimalAmount,
      minorUnitDigits,
    };
  }

  /**
   * Create a MoneyValue object from minor units integer string and currency code.
   */
  public static createMoneyFromMinor(amountMinor: string, currencyCode: string): MoneyValue {
    const code = currencyCode.toUpperCase();
    const currency = CurrencyRegistryService.getCurrency(code);
    const minorUnitDigits = currency ? currency.precision.minorUnitDigits : 2;

    const minorDec = new Decimal(amountMinor);
    const factor = new Decimal(10).pow(minorUnitDigits);
    const decimalAmount = minorDec.div(factor).toFixed(minorUnitDigits);

    return {
      currencyCode: code,
      representationType: 'MINOR_UNITS',
      amountMinor: minorDec.toDecimalPlaces(0).toString(),
      decimalAmount,
      minorUnitDigits,
    };
  }

  /**
   * Add two MoneyValues of the SAME currency.
   */
  public static add(a: MoneyValue, b: MoneyValue): MoneyValue {
    if (a.currencyCode !== b.currencyCode) {
      throw new Error(
        `CURRENCY_MISMATCH_ADDITION: Cannot add ${a.currencyCode} to ${b.currencyCode} without explicit conversion`
      );
    }
    const decA = new Decimal(a.decimalAmount);
    const decB = new Decimal(b.decimalAmount);
    const sum = decA.add(decB);
    return this.createMoney(sum.toString(), a.currencyCode);
  }

  /**
   * Subtract MoneyValue b from MoneyValue a (SAME currency).
   */
  public static subtract(a: MoneyValue, b: MoneyValue): MoneyValue {
    if (a.currencyCode !== b.currencyCode) {
      throw new Error(
        `CURRENCY_MISMATCH_SUBTRACTION: Cannot subtract ${b.currencyCode} from ${a.currencyCode} without explicit conversion`
      );
    }
    const decA = new Decimal(a.decimalAmount);
    const decB = new Decimal(b.decimalAmount);
    const diff = decA.sub(decB);
    return this.createMoney(diff.toString(), a.currencyCode);
  }

  /**
   * Multiply MoneyValue by exact Islamic fraction (numerator / denominator).
   * Returns exact unrounded Decimal and exact rounded MoneyValue.
   */
  public static multiplyByFraction(
    money: MoneyValue,
    fraction: Fraction | { numerator: number | bigint; denominator: number | bigint }
  ): { unroundedDecimal: string; roundedMoney: MoneyValue } {
    const num = new Decimal(fraction.numerator.toString());
    const den = new Decimal(fraction.denominator.toString());

    if (den.isZero()) {
      throw new Error('DIVISION_BY_ZERO: Fraction denominator cannot be zero');
    }

    const baseDec = new Decimal(money.decimalAmount);
    const unroundedDec = baseDec.mul(num).div(den);

    const roundedMoney = this.createMoney(unroundedDec.toString(), money.currencyCode);

    return {
      unroundedDecimal: unroundedDec.toString(),
      roundedMoney,
    };
  }

  /**
   * Multiply MoneyValue by exact exchange rate decimal string.
   */
  public static multiplyByRate(
    sourceMoney: MoneyValue,
    rateValue: string,
    targetCurrencyCode: string
  ): { unroundedDecimal: string; roundedMoney: MoneyValue } {
    const rateDec = new Decimal(rateValue);
    if (rateDec.isNegative() || rateDec.isZero()) {
      throw new Error('INVALID_EXCHANGE_RATE: Rate must be a positive non-zero decimal');
    }

    const sourceDec = new Decimal(sourceMoney.decimalAmount);
    const unroundedDec = sourceDec.mul(rateDec);

    const roundedMoney = this.createMoney(unroundedDec.toString(), targetCurrencyCode);

    return {
      unroundedDecimal: unroundedDec.toString(),
      roundedMoney,
    };
  }

  /**
   * Divide MoneyValue by an integer divisor.
   */
  public static divideByInteger(
    money: MoneyValue,
    divisor: number
  ): { unroundedDecimal: string; roundedMoney: MoneyValue } {
    if (divisor <= 0) {
      throw new Error('INVALID_DIVISOR: Divisor must be a positive non-zero integer');
    }
    const baseDec = new Decimal(money.decimalAmount);
    const divDec = new Decimal(divisor);
    const unroundedDec = baseDec.div(divDec);
    const roundedMoney = this.createMoney(unroundedDec.toString(), money.currencyCode);

    return {
      unroundedDecimal: unroundedDec.toString(),
      roundedMoney,
    };
  }

  /**
   * Compare two MoneyValues of the SAME currency.
   * Returns -1 if a < b, 0 if a === b, 1 if a > b.
   */
  public static compare(a: MoneyValue, b: MoneyValue): number {
    if (a.currencyCode !== b.currencyCode) {
      throw new Error(
        `CURRENCY_MISMATCH_COMPARISON: Cannot compare ${a.currencyCode} with ${b.currencyCode}`
      );
    }
    const decA = new Decimal(a.decimalAmount);
    const decB = new Decimal(b.decimalAmount);
    return decA.comparedTo(decB);
  }

  /**
   * Sum an array of MoneyValues of the SAME currency.
   */
  public static sum(monies: MoneyValue[], currencyCode: string): MoneyValue {
    const code = currencyCode.toUpperCase();
    let total = new Decimal(0);

    for (const m of monies) {
      if (m.currencyCode !== code) {
        throw new Error(
          `CURRENCY_MISMATCH_SUM: Item currency ${m.currencyCode} does not match expected ${code}`
        );
      }
      total = total.add(new Decimal(m.decimalAmount));
    }

    return this.createMoney(total.toString(), code);
  }
}
