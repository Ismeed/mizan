/**
 * MIZAN — Typed Rule Decision System
 *
 * Every rule decision is a discriminated union member.
 * No executable code is permitted in decision payloads.
 * The RuleExecutor's DecisionHandlerRegistry interprets each decision type.
 */

import { Frac } from '../utils/fraction.utils';

// ─── Mirath Decision Types ───────────────────────────────────────────────────

/** Assigns a Quranic fixed fraction (Fard) to an heir group */
export interface AssignFixedFractionDecision {
  decisionType: 'ASSIGN_FIXED_FRACTION';
  /** Canonical heir key matching HeirsInput keys (e.g. "husband", "wives", "daughters") */
  targetEntity: string;
  /** Exact rational share — no floating-point */
  fraction: Frac;
  /** How to distribute within the group */
  distributionMethod: 'EQUAL_SHARE' | 'SINGLE_SHARE' | 'MALE_DOUBLE_FEMALE';
  /** Conditions under which this fraction applies (used for audit display only) */
  conditionSummary?: string;
}

/** Assigns Asabah (residuary) status to an heir group */
export interface AssignResiduaryStatusDecision {
  decisionType: 'ASSIGN_RESIDUARY_STATUS';
  targetEntity: string;
  residuaryClass: 'ASABAH_BIN_NAFS' | 'ASABAH_BIL_GHAIR' | 'ASABAH_MAL_GHAIR';
}

/** Applies Hijab hirman — complete blocking of an heir */
export interface BlockHeirDecision {
  decisionType: 'BLOCK_HEIR';
  /** The heir being blocked */
  targetEntity: string;
  /** The heir that causes the blocking */
  blockingEntity: string;
  reasonCode: string;
  /** Whether this is complete (hirman) or partial (nuqsan) blocking */
  blockingType: 'COMPLETE' | 'PARTIAL';
}

/** Reduces a share (e.g. spouse share when children exist) */
export interface ReduceShareDecision {
  decisionType: 'REDUCE_SHARE';
  targetEntity: string;
  reductionMethod: 'AWL_PROPORTIONAL' | 'PRESENCE_OF_CHILDREN' | 'CUSTOM';
  reducedFraction?: Frac;
}

/** Changes eligibility status of an heir group */
export interface ChangeEligibilityDecision {
  decisionType: 'CHANGE_ELIGIBILITY';
  targetEntity: string;
  eligibilityStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'CONDITIONAL';
  reasonCode: string;
}

// ─── Zakat Decision Types ─────────────────────────────────────────────────────

/** Sets the Zakat rate as exact rational + basis points */
export interface SetZakatRateDecision {
  decisionType: 'SET_ZAKAT_RATE';
  /** Basis points for the rate — 2.5% = 250 basis points */
  rateBasisPoints: number;
  /** Exact rational representation — 2.5% = { n: 1, d: 40 } */
  rateAsRational: Frac;
  /** Human-readable label */
  rateLabel: string;
}

/** Sets the Nisab threshold method */
export interface SetNisabMethodDecision {
  decisionType: 'SET_NISAB_METHOD';
  nisabMethod: 'GOLD' | 'SILVER' | 'LOWER' | 'HIGHER';
  goldGrams?: number;
  silverGrams?: number;
}

/** References a livestock Zakat schedule record */
export interface ApplyLivestockScheduleDecision {
  decisionType: 'APPLY_LIVESTOCK_SCHEDULE';
  scheduleId: string;
  scheduleVersion: string;
  livestockType: 'CAMEL' | 'CATTLE' | 'SHEEP_GOAT';
}

/** Sets the Hawl (holding period) requirement */
export interface SetHoldingPeriodDecision {
  decisionType: 'SET_HOLDING_PERIOD';
  lunarMonths: number;
  description?: string;
}

/** Aggregates multiple asset categories for Nisab comparison */
export interface AggregateAssetCategoriesDecision {
  decisionType: 'AGGREGATE_ASSET_CATEGORIES';
  categories: string[];
  aggregationMethod: 'SUM' | 'NET_AFTER_LIABILITIES';
}

/** Excludes an asset category from Zakatable wealth */
export interface ExcludeAssetCategoryDecision {
  decisionType: 'EXCLUDE_ASSET_CATEGORY';
  category: string;
  reasonCode: string;
  description?: string;
}

// ─── Governance Decision Types ────────────────────────────────────────────────

/** Requires mandatory scholar review before finalising a result */
export interface RequireScholarReviewDecision {
  decisionType: 'REQUIRE_SCHOLAR_REVIEW';
  reasonCode: string;
  affectedTopic: string;
  /** Knowledge ID of the public explanation to surface to the user */
  publicExplanationId?: string;
  severity: 'INFORMATIONAL' | 'WARNING' | 'MANDATORY_STOP';
}

/** Adds a non-blocking warning to the result */
export interface AddWarningDecision {
  decisionType: 'ADD_WARNING';
  warningCode: string;
  publicExplanationId?: string;
  userMessage: string;
}

/** Stops a calculation branch due to an unresolvable condition */
export interface StopCalculationBranchDecision {
  decisionType: 'STOP_CALCULATION_BRANCH';
  reasonCode: string;
  requiresManualReview: boolean;
  publicExplanationId?: string;
}

/**
 * Applies a canonical Hijab rule to an heir.
 * References a HijabRuleRecord by ID so the executor can load the full
 * evidence chain and multilingual explanation.
 */
export interface ApplyHijabDecision {
  decisionType: 'APPLY_HIJAB';
  /** The heir being blocked or reduced */
  targetEntity: string;
  /** The heir or attribute causing the blocking */
  blockingCause: string;
  /** Whether this is HIRMAN (complete) or NUQSAN (partial) */
  effectType: 'HIRMAN' | 'NUQSAN';
  /** Permanent ID of the canonical HijabRuleRecord */
  hijabRuleId: string;
  /** Version of the HijabRuleRecord applied */
  hijabRuleVersion: string;
  /** Optional: the reduced fraction for NUQSAN decisions */
  reducedFraction?: { numerator: number; denominator: number };
}

// ─── Union Type ───────────────────────────────────────────────────────────────

export type RuleDecision =
  | AssignFixedFractionDecision
  | AssignResiduaryStatusDecision
  | BlockHeirDecision
  | ReduceShareDecision
  | ChangeEligibilityDecision
  | SetZakatRateDecision
  | SetNisabMethodDecision
  | ApplyLivestockScheduleDecision
  | SetHoldingPeriodDecision
  | AggregateAssetCategoriesDecision
  | ExcludeAssetCategoryDecision
  | RequireScholarReviewDecision
  | AddWarningDecision
  | StopCalculationBranchDecision
  | ApplyHijabDecision;

export type RuleDecisionType = RuleDecision['decisionType'];

/** Execution result for a single decision */
export interface DecisionExecutionResult {
  decisionType: RuleDecisionType;
  success: boolean;
  appliedTo: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}
