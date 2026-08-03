/**
 * MIZAN — Livestock Eligibility Contracts (Phase 9)
 *
 * 19 result codes for livestock eligibility decisions.
 */

export type LivestockEligibilityStatusCode =
  | 'ELIGIBLE_FOR_LIVESTOCK_SCHEDULE'
  | 'NOT_ELIGIBLE_FOR_LIVESTOCK_SCHEDULE'
  | 'BELOW_APPROVED_THRESHOLD'
  | 'HOLDING_PERIOD_INCOMPLETE'
  | 'FEEDING_OR_GRAZING_CONDITION_NOT_MET'
  | 'COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE'
  | 'JOINT_OWNERSHIP_REVIEW_REQUIRED'
  | 'INSUFFICIENT_FACTS'
  | 'UNSUPPORTED_FOR_SELECTED_MADHHAB'
  | 'SCHOLAR_REVIEW_REQUIRED'
  | 'WORK_ANIMALS_EXEMPT'
  | 'PERSONAL_USE_EXEMPT'
  | 'INVALID_ANIMAL_COUNT'
  | 'INVALID_ANIMAL_TYPE'
  | 'SCHEDULE_NOT_FOUND'
  | 'SCHEDULE_GAP_DETECTED'
  | 'SCHEDULE_OVERLAP_DETECTED'
  | 'DUPLICATE_HERD_DETECTED'
  | 'CROSS_CATEGORY_DOUBLE_COUNTING_RISK';

export interface LivestockEligibilityResult {
  status: LivestockEligibilityStatusCode;
  isEligible: boolean;
  appliedRuleIds: string[];
  evidenceIds: string[];
  reasonCode: string;
  explanationText?: string;
  requiresScholarReview: boolean;
}

export interface LivestockEligibilityRuleLink {
  linkId: string;
  ruleId: string;
  animalTypeIds: string[];
  madhhabScope: {
    appliesTo: string[];
  };
}
