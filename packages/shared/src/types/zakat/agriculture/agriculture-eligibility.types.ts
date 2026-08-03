/**
 * MIZAN — Agriculture Eligibility Contracts (Phase 10)
 */

export type AgricultureEligibilityReasonCode =
  | 'ELIGIBLE'
  | 'BELOW_NISAB'
  | 'PRODUCE_NOT_ZAKATABLE'
  | 'HAWL_NOT_REQUIRED'
  | 'OWNERSHIP_DEFICIENT'
  | 'IRRIGATION_REVIEW_REQUIRED'
  | 'QUALITY_BELOW_MINIMUM'
  | 'HARVEST_NOT_CONFIRMED'
  | 'AGGREGATION_POLICY_UNKNOWN'
  | 'PRODUCE_TYPE_REVIEW_REQUIRED'
  | 'MIXED_IRRIGATION_REVIEW_REQUIRED'
  | 'SEASONAL_SCOPE_MISMATCH'
  | 'JOINT_OWNERSHIP_REVIEW'
  | 'REVIEW_REQUIRED'
  | 'SCHEDULE_NOT_FOUND';

export interface AgricultureEligibilityResult {
  status: AgricultureEligibilityReasonCode;
  isEligible: boolean;
  appliedRuleIds: string[];
  evidenceIds: string[];
  reasonCode: AgricultureEligibilityReasonCode;
  explanationText: string;
  requiresScholarReview: boolean;
}
