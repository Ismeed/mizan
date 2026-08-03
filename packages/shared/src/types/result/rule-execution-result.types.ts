/**
 * MIZAN — Rule Execution Result Contract (Phase 13)
 * Authoritative decision produced internally by one executed rule.
 */

import type { RuleModule } from '../canonical-rule.types';
import type { Madhhab } from '../inheritance.types';
import type { AnyRuleTypeString } from '../rule-types.registry';
import type { CalculationWarning } from './result-warning.types';
import type { CalculationError } from './result-error.types';

export interface RuleExecutionIdentity {
  ruleId: string;
  ruleVersion: string;
  ruleFamilyId: string;
  ruleType: AnyRuleTypeString;
  module: RuleModule;
}

export interface RuleExecutionResolution {
  selectedMadhhab: Madhhab;
  resolutionMode: 'BASE_RULE_DIRECT' | 'USE_BASE_WITH_OVERRIDES' | 'OVERRIDE_REPLACES_BASE';
  baseRule: { ruleId: string; version: string };
  appliedOverrides: string[];
  parallelBranch?: string | null;
  resolvedRuleSnapshotId: string;
  resolvedRuleChecksum: string;
}

export interface RuleExecutionMatch {
  status: 'MATCHED' | 'NOT_MATCHED' | 'SKIPPED' | 'ERROR';
  matchedConditions: string[];
  failedConditions: string[];
  conditionTraceIds: string[];
}

export interface RuleExecutionPayload<TDecisionPayload = Record<string, unknown>> {
  status: 'APPLIED' | 'NOT_APPLIED' | 'STOPPED' | 'REVIEW_REQUIRED' | 'CONFLICT' | 'ERROR';
  decisionType: string;
  decisionPayload: TDecisionPayload;
  terminal: boolean;
  nextStage?: string | null;
}

export interface RuleExecutionReferences {
  evidenceLinks: string[];
  explanationLinks: string[];
  sourceRecordIds: string[];
}

export interface RuleExecutionTraceMetadata {
  traceId: string;
  executedAt: string;
  durationMilliseconds?: number | null;
}

export interface RuleExecutionResult<TDecisionPayload = Record<string, unknown>> {
  ruleExecutionResultId: string;
  rule: RuleExecutionIdentity;
  resolution: RuleExecutionResolution;
  match: RuleExecutionMatch;
  execution: RuleExecutionPayload<TDecisionPayload>;
  references: RuleExecutionReferences;
  warnings: CalculationWarning[];
  errors: CalculationError[];
  trace: RuleExecutionTraceMetadata;
}
