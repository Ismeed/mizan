/**
 * MIZAN — Applied Rule Reference Contract (Phase 13)
 * Identifies rules that produced a specific decision or result item.
 */

import type { AnyRuleTypeString } from '../rule-types.registry';
import type { Madhhab } from '../inheritance.types';

export type RuleRelationshipToDecision =
  | 'PRIMARY'
  | 'SUPPORTING'
  | 'PREREQUISITE'
  | 'OVERRIDE'
  | 'EXCEPTION'
  | 'ADJUSTMENT';

export interface AppliedRuleResolutionSnapshot {
  baseRuleId: string;
  baseRuleVersion: string;
  overrideIds: string[];
  parallelBranchId?: string | null;
  resolvedRuleSnapshotId: string;
}

export interface AppliedRuleReference {
  ruleId: string;
  ruleVersion: string;
  ruleFamilyId: string;
  ruleType: AnyRuleTypeString;
  relationshipToDecision: RuleRelationshipToDecision;
  ruleExecutionResultId: string;
  selectedMadhhab: Madhhab;
  resolution: AppliedRuleResolutionSnapshot;
}
