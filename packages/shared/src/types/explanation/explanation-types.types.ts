/**
 * Explanation Core Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export type ExplanationModuleId = 'MIRATH' | 'ZAKAT' | 'SHARED';

export type ExplanationType =
  | 'CALCULATION_DECISION'
  | 'ELIGIBILITY'
  | 'FIXED_SHARE'
  | 'RESIDUARY_STATUS'
  | 'HIJAB_COMPLETE_EXCLUSION'
  | 'HIJAB_PARTIAL_EFFECT'
  | 'NISAB_RESULT'
  | 'HOLDING_PERIOD_RESULT'
  | 'ZAKAT_RATE'
  | 'LIVESTOCK_SCHEDULE_RESULT'
  | 'AGRICULTURE_IRRIGATION_RESULT'
  | 'AGRICULTURE_AGGREGATION_RESULT'
  | 'DEDUCTION_RESULT'
  | 'EVIDENCE_EXPLANATION'
  | 'WARNING'
  | 'REVIEW_REQUIRED'
  | 'UNSUPPORTED_CASE'
  | 'EDUCATIONAL_NOTE';

export type ExplanationDisplayMode = 'SHORT' | 'FULL' | 'EDUCATIONAL';

export type ExplanationResolutionStatus =
  | 'RESOLVED'
  | 'FALLBACK_USED'
  | 'UNAVAILABLE'
  | 'REVIEW_REQUIRED';

export type MadhhabScopeMode = 'SHARED' | 'SELECTIVE' | 'SINGLE_MADHHAB';
