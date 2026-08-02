/**
 * MIZAN — Madhhab Resolution Types & Contracts (Phase 5)
 *
 * Defines contracts for Madhhab-specific rule scoping, overrides,
 * branching strategies, and per-calculation resolution audits.
 */

import { RuleMadhhabScope, CanonicalRule } from './canonical-rule.types';
import { MadhhabCode, CalculationProfile } from './profile.types';

export type MadhhabBranchStrategy =
  | 'SHARED_BASE'
  | 'PARTIAL_AGREEMENT'
  | 'NARROW_OVERRIDE'
  | 'FULL_BRANCH';

export interface MadhhabRuleBranch {
  branchId: string;
  ruleFamilyId: string;
  applicableMadhhabs: RuleMadhhabScope[];
  branchStrategy: MadhhabBranchStrategy;
  branchRuleId: string;
  branchRuleVersion: string;
  notes?: string;
  createdAt: string;
}

export interface RuleMatchPayload {
  rule: CanonicalRule;
  matched: boolean;
  conditionCount: number;
}

export interface MadhhabResolutionInput {
  madhhab: MadhhabCode;
  matchedResults: RuleMatchPayload[];
  profile?: CalculationProfile;
}

export interface MadhhabResolutionTrace {
  ruleId: string;
  ruleVersion: string;
  titleEn: string;
  madhhab: string;
  selectionReason: string;
  conditionCount: number;
  priority: number;
  wasOverridden: boolean;
  overriddenBy?: string;
  branchStrategy?: MadhhabBranchStrategy;
  branchId?: string;
  madhhabFiltered: boolean;
  overrideApplied: boolean;
  overriddenBaseRuleId?: string;
}

export interface MadhhabResolutionOutput {
  status: 'RESOLVED' | 'NO_RULES_MATCHED' | 'RULE_CONFLICT_DETECTED' | 'PARTIAL_CONFLICT';
  resolvedRules: CanonicalRule[];
  resolutionTrace: MadhhabResolutionTrace[];
  branchesSelected: Array<{
    ruleFamilyId: string;
    branchId?: string;
    branchStrategy: MadhhabBranchStrategy;
    selectedRuleId: string;
  }>;
  conflictReport?: any;
  resolvedAt: string;
}

export type MadhhabAgreementMap = Record<MadhhabCode, string[]>;
