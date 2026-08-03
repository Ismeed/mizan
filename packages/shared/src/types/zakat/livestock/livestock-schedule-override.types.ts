/**
 * MIZAN — Controlled Livestock Schedule Override Contract (Phase 9)
 *
 * Defines explicit override operations per madhhab branch.
 */

export type LivestockScheduleOverrideOperation =
  | 'ADD_BAND'
  | 'REMOVE_BAND_BY_ID'
  | 'REPLACE_BAND_BY_ID'
  | 'REPLACE_RANGE_BOUNDARY'
  | 'REPLACE_OBLIGATION_REFERENCE'
  | 'ADD_ELIGIBILITY_RULE'
  | 'REMOVE_ELIGIBILITY_RULE'
  | 'REPLACE_PATTERN_UNIT'
  | 'ADD_REMAINDER_RULE'
  | 'REPLACE_REMAINDER_RULE'
  | 'ADD_COMBINATION_RULE'
  | 'REPLACE_TIE_BREAK_POLICY'
  | 'ADD_EVIDENCE_LINK'
  | 'REPLACE_EXPLANATION_LINK'
  | 'REQUIRE_SCHOLAR_REVIEW';

export interface LivestockScheduleOverride {
  overrideId: string;
  version: string;
  targetScheduleId: string;
  targetComponentId: string;
  madhhab: string;
  operation: LivestockScheduleOverrideOperation;
  payload: Record<string, unknown>;
  evidenceIds: string[];
  explanationIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
  };
}

export interface LivestockResolvedSchedule {
  baseScheduleId: string;
  baseScheduleVersion: string;
  selectedMadhhab: string;
  appliedOverrideIds: string[];
  resolvedScheduleChecksum: string;
  effectiveBands: unknown[];
  effectivePatterns: unknown[];
}
