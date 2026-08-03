/**
 * MIZAN — Livestock Eligibility Service (Phase 9)
 *
 * Evaluates livestock eligibility rules separate from schedule resolution.
 * Supports 19 structured result codes.
 */

import type { CanonicalLivestockFacts, LivestockEligibilityResult } from '@mizan/shared';

export class LivestockEligibilityService {
  public evaluateEligibility(
    facts: CanonicalLivestockFacts,
    madhhab: string
  ): LivestockEligibilityResult {
    const { herd, ownership, feedingAndGrazing, purpose, jointOwnership } = facts;

    // 1. Integer check
    if (!Number.isInteger(herd.totalCount) || herd.totalCount < 0) {
      return {
        status: 'INVALID_ANIMAL_COUNT',
        isEligible: false,
        appliedRuleIds: ['RULE-ELIG-INVALID-COUNT'],
        evidenceIds: [],
        reasonCode: 'INVALID_ANIMAL_COUNT',
        explanationText: 'Animal count must be a non-negative integer.',
        requiresScholarReview: false,
      };
    }

    // 2. Purpose classification check — Work animals / Trade animals
    if (purpose.classification === 'WORK') {
      return {
        status: 'WORK_ANIMALS_EXEMPT',
        isEligible: false,
        appliedRuleIds: ['RULE-ELIG-WORK-ANIMALS'],
        evidenceIds: ['HADITH-WORK-ANIMALS-EXEMPT'],
        reasonCode: 'WORK_ANIMALS_EXEMPT',
        explanationText: 'Animals held primarily for work (plowing, transport) are exempt from livestock Zakat.',
        requiresScholarReview: false,
      };
    }

    if (purpose.classification === 'TRADE') {
      return {
        status: 'COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE',
        isEligible: false,
        appliedRuleIds: ['RULE-ELIG-TRADE-LIVESTOCK'],
        evidenceIds: ['FIQH-TRADE-LIVESTOCK-INVENTORY'],
        reasonCode: 'COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE',
        explanationText: 'Livestock held for trade stock are assessed as business inventory (2.5% market value), not under livestock count schedules.',
        requiresScholarReview: false,
      };
    }

    // 3. Feeding & Grazing check (Hanafi/Shafii/Hanbali require Sa'imah - grazing majority of year)
    if (feedingAndGrazing.method === 'FODDER_FED' && madhhab !== 'MALIKI') {
      return {
        status: 'FEEDING_OR_GRAZING_CONDITION_NOT_MET',
        isEligible: false,
        appliedRuleIds: ['RULE-ELIG-SAIMAH-REQUIRED'],
        evidenceIds: ['HADITH-SAIMAH-GRAZING'],
        reasonCode: 'FEEDING_OR_GRAZING_CONDITION_NOT_MET',
        explanationText: 'In the selected madhhab, livestock Zakat requires animals to be grazing (Sa\'imah) for most of the lunar year.',
        requiresScholarReview: false,
      };
    }

    // 4. Holding period (Hawl) check
    if (!ownership.hawlMet) {
      return {
        status: 'HOLDING_PERIOD_INCOMPLETE',
        isEligible: false,
        appliedRuleIds: ['RULE-ELIG-HAWL-REQUIRED'],
        evidenceIds: ['HADITH-HAWL-LIVESTOCK'],
        reasonCode: 'HOLDING_PERIOD_INCOMPLETE',
        explanationText: 'Hawl (one full lunar year in possession) has not been completed for this herd.',
        requiresScholarReview: false,
      };
    }

    // 5. Joint ownership check
    if (jointOwnership.isJointlyOwned) {
      return {
        status: 'JOINT_OWNERSHIP_REVIEW_REQUIRED',
        isEligible: true,
        appliedRuleIds: ['RULE-ELIG-JOINT-OWNERSHIP'],
        evidenceIds: ['HADITH-KHULATA-JOINT-HERD'],
        reasonCode: 'JOINT_OWNERSHIP_REVIEW_REQUIRED',
        explanationText: 'Joint ownership (Khulata) rules apply. Scholar review advised for exact share aggregation.',
        requiresScholarReview: true,
      };
    }

    // Eligible for schedule evaluation
    return {
      status: 'ELIGIBLE_FOR_LIVESTOCK_SCHEDULE',
      isEligible: true,
      appliedRuleIds: ['RULE-ELIG-STANDARD-LIVESTOCK'],
      evidenceIds: ['HADITH-LIVESTOCK-ZAKAT-GENERAL'],
      reasonCode: 'ELIGIBLE_FOR_LIVESTOCK_SCHEDULE',
      explanationText: 'Herd meets all eligibility criteria for livestock schedule resolution.',
      requiresScholarReview: false,
    };
  }
}
