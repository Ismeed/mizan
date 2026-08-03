/**
 * MIZAN — Agriculture Aggregation Service (Phase 10)
 */

import {
  BASELINE_SYNTHETIC_AGRICULTURE_AGGREGATION_POLICIES,
  AgricultureAggregatedResult,
  CanonicalAgricultureFacts,
  ExactFraction,
  addExactFractions,
  compareExactFractions,
} from '@mizan/shared';
import { AgricultureNisabService } from './agriculture-nisab.service';

export class AgricultureAggregationService {
  private policies = BASELINE_SYNTHETIC_AGRICULTURE_AGGREGATION_POLICIES;
  private nisabService = new AgricultureNisabService();

  public aggregateHarvests(
    harvestFacts: CanonicalAgricultureFacts[],
    madhhab: string
  ): AgricultureAggregatedResult {
    if (harvestFacts.length === 0) {
      return {
        combinedQuantity: { numerator: 0n, denominator: 1n },
        aggregationPolicyId: 'NONE',
        harvestInstanceIds: [],
        isAboveNisab: false,
      };
    }

    const policy = this.policies.find(p => p.madhhabScope.appliesTo.includes(madhhab)) ?? this.policies[0];

    let totalQuantity: ExactFraction = { numerator: 0n, denominator: 1n };
    const harvestInstanceIds: string[] = [];

    for (const fact of harvestFacts) {
      totalQuantity = addExactFractions(totalQuantity, fact.harvest.quantity);
      harvestInstanceIds.push(fact.assetInstanceId);
    }

    const firstProduceType = harvestFacts[0].produceTypeId;
    const nisabRecord = this.nisabService.resolveNisab(firstProduceType, madhhab);
    const isAboveNisab = nisabRecord
      ? compareExactFractions(totalQuantity, nisabRecord.thresholdQuantity) >= 0
      : false;

    return {
      combinedQuantity: totalQuantity,
      aggregationPolicyId: policy.policyId,
      harvestInstanceIds,
      isAboveNisab,
    };
  }
}
