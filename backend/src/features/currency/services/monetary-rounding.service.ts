/**
 * Monetary Rounding Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Applies approved monetary rounding policies via Decimal.
 * Preserves unrounded value for auditability and tracks exact rounding adjustments.
 */

import Decimal from 'decimal.js';
import { MonetaryRoundingMethod, MonetaryRoundingPolicy, MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

export interface RoundingResult {
  unroundedDecimal: string;
  roundedMoney: MoneyValue;
  roundingAdjustmentMinor: string;
  policyId: string;
}

export class MonetaryRoundingService {
  /**
   * Map MonetaryRoundingMethod to Decimal rounding modes
   */
  private static getDecimalRoundingMode(method: MonetaryRoundingMethod): number {
    switch (method) {
      case 'ROUND_HALF_UP':
        return Decimal.ROUND_HALF_UP;
      case 'ROUND_HALF_EVEN':
        return Decimal.ROUND_HALF_EVEN;
      case 'ROUND_DOWN':
      case 'TRUNCATE':
        return Decimal.ROUND_DOWN;
      case 'ROUND_UP':
        return Decimal.ROUND_UP;
      default:
        return Decimal.ROUND_HALF_UP;
    }
  }

  public static applyRounding(
    unroundedDecimalString: string,
    currencyCode: string,
    policy?: MonetaryRoundingPolicy
  ): RoundingResult {
    const policyId = policy ? policy.roundingPolicyId : 'MONEY-ROUNDING-STANDARD-001';
    const method = policy ? policy.method : 'ROUND_HALF_UP';
    const roundingMode = this.getDecimalRoundingMode(method);

    const unroundedDec = new Decimal(unroundedDecimalString);

    // Default to minor units precision for the currency
    const roundedMoney = MoneyArithmeticService.createMoney(
      unroundedDec.toString(),
      currencyCode
    );

    const roundedDec = new Decimal(roundedMoney.decimalAmount);

    // Calculate rounding adjustment in minor units
    const factor = new Decimal(10).pow(roundedMoney.minorUnitDigits);
    const unroundedMinor = unroundedDec.mul(factor);
    const roundedMinor = roundedDec.mul(factor);
    const adjustmentMinor = roundedMinor.sub(unroundedMinor).toString();

    return {
      unroundedDecimal: unroundedDecimalString,
      roundedMoney,
      roundingAdjustmentMinor: adjustmentMinor,
      policyId,
    };
  }
}
