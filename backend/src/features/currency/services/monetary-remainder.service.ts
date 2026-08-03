/**
 * Monetary Remainder Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Reconciles minor rounding imbalances (e.g. 1 cent/kobo surplus/deficit) across heir allocations.
 * NEVER alters underlying Islamic fractions.
 */

import Decimal from 'decimal.js';
import { MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

export interface AllocationCandidate {
  id: string;
  unroundedDecimal: string;
  roundedMoney: MoneyValue;
}

export interface ReconciledAllocation {
  id: string;
  finalMoney: MoneyValue;
  adjustmentMinor: string;
}

export class MonetaryRemainderService {
  public static reconcileLargestRemainder(
    totalDistributable: MoneyValue,
    allocations: AllocationCandidate[]
  ): { reconciled: ReconciledAllocation[]; remainderMinor: string } {
    const currencyCode = totalDistributable.currencyCode;
    const factor = new Decimal(10).pow(totalDistributable.minorUnitDigits);

    // Sum allocated rounded minor units
    let allocatedMinorSum = new Decimal(0);
    const itemRemainders: { id: string; remainderFraction: Decimal; candidate: AllocationCandidate }[] = [];

    for (const alloc of allocations) {
      const roundedMinor = new Decimal(alloc.roundedMoney.amountMinor);
      allocatedMinorSum = allocatedMinorSum.add(roundedMinor);

      const unroundedMinor = new Decimal(alloc.unroundedDecimal).mul(factor);
      const remainderFraction = unroundedMinor.sub(roundedMinor);

      itemRemainders.push({ id: alloc.id, remainderFraction, candidate: alloc });
    }

    const netEstateMinor = new Decimal(totalDistributable.amountMinor);
    const diffMinor = netEstateMinor.sub(allocatedMinorSum); // Surplus (+) or deficit (-) in minor units

    const reconciled: ReconciledAllocation[] = [];

    // Sort candidates by remainder fraction descending
    itemRemainders.sort((a, b) => b.remainderFraction.comparedTo(a.remainderFraction));

    let remainingDiff = diffMinor;

    const adjustmentMap: Record<string, Decimal> = {};
    for (const item of allocations) {
      adjustmentMap[item.id] = new Decimal(0);
    }

    // Distribute 1 minor unit at a time to candidates with largest fractional remainders
    if (remainingDiff.gt(0)) {
      let idx = 0;
      while (remainingDiff.gt(0) && idx < itemRemainders.length) {
        const candidateId = itemRemainders[idx].id;
        adjustmentMap[candidateId] = adjustmentMap[candidateId].add(1);
        remainingDiff = remainingDiff.sub(1);
        idx++;
      }
    } else if (remainingDiff.lt(0)) {
      let idx = itemRemainders.length - 1;
      while (remainingDiff.lt(0) && idx >= 0) {
        const candidateId = itemRemainders[idx].id;
        adjustmentMap[candidateId] = adjustmentMap[candidateId].sub(1);
        remainingDiff = remainingDiff.add(1);
        idx--;
      }
    }

    for (const alloc of allocations) {
      const adj = adjustmentMap[alloc.id];
      const origMinor = new Decimal(alloc.roundedMoney.amountMinor);
      const finalMinor = origMinor.add(adj).toString();

      const finalMoney = MoneyArithmeticService.createMoneyFromMinor(finalMinor, currencyCode);

      reconciled.push({
        id: alloc.id,
        finalMoney,
        adjustmentMinor: adj.toString(),
      });
    }

    return {
      reconciled,
      remainderMinor: remainingDiff.toString(),
    };
  }
}
