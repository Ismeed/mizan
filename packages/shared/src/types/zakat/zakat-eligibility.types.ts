/**
 * MIZAN — Zakat Eligibility Decision Contract (Phase 8)
 *
 * Defines the output contract for Zakat eligibility decisions.
 * These are produced by the Rule Engine — not this file.
 *
 * CRITICAL:
 * - This file defines the STRUCTURAL CONTRACT for eligibility decisions ONLY.
 * - Eligibility values (zakatable: true/false) must never be hardcoded here.
 * - All eligibility decisions must reference a CanonicalRule and evidence.
 * - These types are READ-ONLY outputs from the Rule Engine.
 */

import type { CanonicalZakatCategoryId } from './canonical-zakat-category.types';

/** Whether a Zakat category is zakatable in a specific case */
export type ZakatEligibilityStatus =
  | 'ZAKATABLE'             // The category is zakatable in this case
  | 'EXEMPT'                // The category is exempt in this case
  | 'PARTIALLY_ZAKATABLE'   // Only part of the category is zakatable
  | 'DEFERRED'              // Obligation deferred (e.g. hawl not met)
  | 'UNDETERMINED'          // Rule Engine could not determine status
  | 'NOT_APPLICABLE';       // Category is a liability (not an asset subject to zakat)

/** Aggregation decision — whether category is combined with others for nisab */
export type ZakatAggregationDecision =
  | 'STANDALONE'        // Category is assessed independently against nisab
  | 'AGGREGATED'        // Category is combined with specified others
  | 'NOT_APPLICABLE';   // Not relevant (liability categories)

/** The rate decision for a zakatable category */
export interface ZakatRateDecision {
  /** Rate as a fraction: 2.5% = {numerator: 1, denominator: 40} */
  numerator: number;
  denominator: number;
  /** Human-readable rate label, e.g. "2.5%" */
  rateLabel: string;
  /** The rule ID that determined this rate */
  appliedRuleId: string;
  /** Notes on why this rate was applied */
  rationale?: string;
}

/** The eligibility decision for a single Zakat category in one calculation */
export interface ZakatCategoryEligibilityDecision {
  categoryId: CanonicalZakatCategoryId;
  eligibilityStatus: ZakatEligibilityStatus;
  /** Amount subject to Zakat */
  zakatableAmount: number;
  /** Zakat due on this category */
  zakatDue: number;
  /** Rate applied */
  rateDecision?: ZakatRateDecision;
  /** Aggregation decision */
  aggregationDecision: ZakatAggregationDecision;
  /** IDs of categories this was aggregated with */
  aggregatedWithCategoryIds?: CanonicalZakatCategoryId[];
  /** The Rule Engine rule that determined this decision */
  appliedRuleId?: string;
  /** Evidence reference IDs supporting this decision */
  evidenceRefIds?: string[];
  /** Human-readable explanation in the user's language */
  explanationText?: string;
}

/** Complete Zakat eligibility output for one calculation */
export interface ZakatEligibilityReport {
  calculationId: string;
  madhhab: string;
  knowledgeReleaseVersion: string;
  /** Whether Zakat is obligatory overall */
  zakatObligatory: boolean;
  /** Total Zakat due across all categories */
  totalZakatDue: number;
  /** Currency of the total */
  currencyCode: string;
  /** Per-category eligibility decisions */
  categoryDecisions: ZakatCategoryEligibilityDecision[];
  /** Total zakatable wealth */
  totalZakatableWealth: number;
  /** Total deductible liabilities */
  totalDeductibleLiabilities: number;
  /** Net zakatable wealth */
  netZakatableWealth: number;
  /** Timestamp of this report */
  generatedAt: string;
}
