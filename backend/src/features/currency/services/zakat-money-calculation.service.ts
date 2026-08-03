/**
 * Zakat Money Calculation Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Performs Zakat monetary calculations using exact Islamic fraction arithmetic (1/40 = 2.5%).
 * Physical obligations (livestock animal due, agricultural produce due) remain non-monetary.
 */

import { Fraction, MoneyValue, ZakatMonetaryResult } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';
import { MonetaryRoundingService } from './monetary-rounding.service';

export class ZakatMoneyCalculationService {
  /** Standard Zakat al-Mal rate fraction: 1/40 (equivalent to 2.5%) */
  public static STANDARD_ZAKAT_RATE: Fraction = { numerator: 1, denominator: 40 };

  public static calculateZakatObligation(input: {
    categoryId: string;
    zakatBaseMoney: MoneyValue;
    isEligible: boolean;
    appliedRuleIds?: string[];
    evidenceIds?: string[];
    nonMonetaryObligation?: {
      obligationType: 'ANIMAL_DUE' | 'PHYSICAL_PRODUCE';
      details: any;
    } | null;
  }): ZakatMonetaryResult {
    const { categoryId, zakatBaseMoney, isEligible, nonMonetaryObligation } = input;
    const currencyCode = zakatBaseMoney.currencyCode;
    const rate = this.STANDARD_ZAKAT_RATE;

    if (nonMonetaryObligation) {
      const zeroMoney = MoneyArithmeticService.createMoney('0', currencyCode);
      return {
        categoryId,
        inputValues: [
          {
            originalMoney: zakatBaseMoney,
            normalizedMoney: zakatBaseMoney,
          },
        ],
        zakatBase: zakatBaseMoney,
        religiousRate: rate,
        unroundedObligationDecimal: '0',
        finalObligation: zeroMoney,
        roundingPolicyId: 'ZAKAT-MONETARY-REMAINDER-001',
        appliedRuleIds: input.appliedRuleIds || [],
        evidenceIds: input.evidenceIds || [],
        nonMonetaryObligation,
      };
    }

    if (!isEligible) {
      const zeroMoney = MoneyArithmeticService.createMoney('0', currencyCode);
      return {
        categoryId,
        inputValues: [
          {
            originalMoney: zakatBaseMoney,
            normalizedMoney: zakatBaseMoney,
          },
        ],
        zakatBase: zakatBaseMoney,
        religiousRate: rate,
        unroundedObligationDecimal: '0',
        finalObligation: zeroMoney,
        roundingPolicyId: 'ZAKAT-MONETARY-REMAINDER-001',
        appliedRuleIds: input.appliedRuleIds || [],
        evidenceIds: input.evidenceIds || [],
        nonMonetaryObligation: null,
      };
    }

    // Multiply base money by exact 1/40 fraction
    const { unroundedDecimal, roundedMoney } = MoneyArithmeticService.multiplyByFraction(
      zakatBaseMoney,
      rate
    );

    const roundingResult = MonetaryRoundingService.applyRounding(unroundedDecimal, currencyCode);

    return {
      categoryId,
      inputValues: [
        {
          originalMoney: zakatBaseMoney,
          normalizedMoney: zakatBaseMoney,
        },
      ],
      zakatBase: zakatBaseMoney,
      religiousRate: rate,
      unroundedObligationDecimal: unroundedDecimal,
      finalObligation: roundingResult.roundedMoney,
      roundingPolicyId: roundingResult.policyId,
      appliedRuleIds: input.appliedRuleIds || [],
      evidenceIds: input.evidenceIds || [],
      nonMonetaryObligation: null,
    };
  }
}
