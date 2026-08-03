/**
 * Mirath Money Allocation Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Performs monetary distribution of a net estate based on exact Islamic inheritance fractions.
 * Exact fractions remain authoritative — monetary amounts are derived via exact Decimal arithmetic.
 */

import { HeirShare, MirathMonetaryDistribution, MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';
import { MonetaryRoundingService } from './monetary-rounding.service';
import { AllocationCandidate, MonetaryRemainderService } from './monetary-remainder.service';

export class MirathMoneyAllocationService {
  public static allocateEstate(input: {
    calculationId: string;
    netEstateMoney: MoneyValue;
    heirShares: HeirShare[];
  }): MirathMonetaryDistribution {
    const { calculationId, netEstateMoney, heirShares } = input;
    const activeShares = heirShares.filter((s) => s.count > 0 && !s.isBlocked);

    const candidates: AllocationCandidate[] = [];
    const heirMetaMap: Map<string, HeirShare> = new Map();

    for (const share of activeShares) {
      const heirKey = share.key.toUpperCase();
      heirMetaMap.set(heirKey, share);

      const fraction = {
        numerator: share.fractionNumerator,
        denominator: share.fractionDenominator,
      };

      const { unroundedDecimal, roundedMoney } = MoneyArithmeticService.multiplyByFraction(
        netEstateMoney,
        fraction
      );

      candidates.push({
        id: heirKey,
        unroundedDecimal,
        roundedMoney,
      });
    }

    // Reconcile monetary remainder
    const { reconciled, remainderMinor } = MonetaryRemainderService.reconcileLargestRemainder(
      netEstateMoney,
      candidates
    );

    const heirDistributions = reconciled.map((rec) => {
      const meta = heirMetaMap.get(rec.id)!;
      const candidate = candidates.find((c) => c.id === rec.id)!;

      return {
        heirId: rec.id,
        heirType: meta.key.toUpperCase(),
        count: meta.count,
        share: {
          numerator: meta.fractionNumerator,
          denominator: meta.fractionDenominator,
        },
        unroundedAllocationDecimal: candidate.unroundedDecimal,
        finalMoney: rec.finalMoney,
        roundingAdjustmentMinor: rec.adjustmentMinor,
        appliedRuleIds: meta.appliedRules || [],
      };
    });

    let totalDistributedMinor = '0';
    for (const hd of heirDistributions) {
      totalDistributedMinor = (
        BigInt(totalDistributedMinor) + BigInt(hd.finalMoney.amountMinor)
      ).toString();
    }

    return {
      calculationId,
      netEstate: {
        currencyMode: 'CONSOLIDATED',
        originalAssets: [],
        calculationCurrencyCode: netEstateMoney.currencyCode,
        convertedNetEstate: netEstateMoney,
      },
      heirDistributions,
      reconciliation: {
        totalDistributedMinor,
        remainderMinor,
        remainderPolicyId: 'MIRATH-MONETARY-REMAINDER-001',
      },
    };
  }
}
