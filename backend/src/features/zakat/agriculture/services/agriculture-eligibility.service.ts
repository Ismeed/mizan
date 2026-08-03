/**
 * MIZAN — Agriculture Eligibility Service (Phase 10)
 */

import {
  CanonicalAgricultureFacts,
  AgricultureEligibilityResult,
  AgricultureEligibilityReasonCode,
} from '@mizan/shared';
import { AgricultureProduceRegistryService } from './agriculture-produce-registry.service';
import { AgricultureNisabService } from './agriculture-nisab.service';

export class AgricultureEligibilityService {
  private produceRegistry = new AgricultureProduceRegistryService();
  private nisabService = new AgricultureNisabService();

  public evaluateEligibility(facts: CanonicalAgricultureFacts, madhhab: string): AgricultureEligibilityResult {
    // 1. Produce type validity
    const produceType = this.produceRegistry.getProduceType(facts.produceTypeId);
    if (!produceType) {
      return this.buildResult('PRODUCE_TYPE_REVIEW_REQUIRED', false, 'Produce type unrecognized or requires review.', true);
    }

    // 2. Ownership check
    if (!facts.ownership.isFullOwner && !facts.ownership.ownershipShare) {
      return this.buildResult('OWNERSHIP_DEFICIENT', false, 'Incomplete ownership information for agriculture Zakat.', true);
    }

    // 3. Nisab check
    const nisabRecord = this.nisabService.resolveNisab(facts.produceTypeId, madhhab);
    if (!nisabRecord) {
      return this.buildResult('SCHEDULE_NOT_FOUND', false, `No approved Nisab record found for produce type ${facts.produceTypeId}.`, true);
    }

    const isAboveNisab = this.nisabService.isAboveNisab(facts.harvest.quantity, nisabRecord.thresholdQuantity);
    if (!isAboveNisab) {
      return this.buildResult('BELOW_NISAB', false, 'Harvest quantity is below the Nisab threshold.', false);
    }

    // 4. All checks passed
    return this.buildResult('ELIGIBLE', true, 'Harvest meets all criteria for Agriculture Zakat eligibility.', false);
  }

  private buildResult(
    reasonCode: AgricultureEligibilityReasonCode,
    isEligible: boolean,
    explanationText: string,
    requiresScholarReview: boolean
  ): AgricultureEligibilityResult {
    return {
      status: reasonCode,
      isEligible,
      appliedRuleIds: [`RULE-AGRI-ELIG-${reasonCode}`],
      evidenceIds: [`EVID-AGRI-ELIG-${reasonCode}`],
      reasonCode,
      explanationText,
      requiresScholarReview,
    };
  }
}
