/**
 * MIZAN — Rule Execution Result Service (Phase 13)
 * Creates authoritative RuleExecutionResult objects when rules match and execute.
 */

import type {
  RuleExecutionResult,
  RuleModule,
  Madhhab,
  AnyRuleTypeString,
} from '@mizan/shared';
import crypto from 'crypto';

export interface CreateRuleExecutionInput<TPayload = Record<string, unknown>> {
  ruleId: string;
  ruleVersion: string;
  ruleFamilyId?: string;
  ruleType: AnyRuleTypeString;
  module: RuleModule;
  selectedMadhhab: Madhhab;
  decisionType: string;
  decisionPayload: TPayload;
  evidenceLinks?: string[];
  explanationLinks?: string[];
}

export class RuleExecutionResultService {
  static createResult<TPayload = Record<string, unknown>>(
    input: CreateRuleExecutionInput<TPayload>
  ): RuleExecutionResult<TPayload> {
    const id = `rule_exec_${crypto.randomUUID()}`;
    const traceId = `trace_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const snapshotContent = JSON.stringify({
      ruleId: input.ruleId,
      ruleVersion: input.ruleVersion,
      madhhab: input.selectedMadhhab,
      decisionType: input.decisionType,
    });
    const snapshotChecksum = crypto.createHash('sha256').update(snapshotContent).digest('hex');

    return {
      ruleExecutionResultId: id,
      rule: {
        ruleId: input.ruleId,
        ruleVersion: input.ruleVersion,
        ruleFamilyId: input.ruleFamilyId ?? `FAMILY-${input.ruleId}`,
        ruleType: input.ruleType,
        module: input.module,
      },
      resolution: {
        selectedMadhhab: input.selectedMadhhab,
        resolutionMode: 'BASE_RULE_DIRECT',
        baseRule: { ruleId: input.ruleId, version: input.ruleVersion },
        appliedOverrides: [],
        resolvedRuleSnapshotId: `snapshot_${input.ruleId}_v${input.ruleVersion}`,
        resolvedRuleChecksum: snapshotChecksum,
      },
      match: {
        status: 'MATCHED',
        matchedConditions: ['ALL_CONDITIONS_SATISFIED'],
        failedConditions: [],
        conditionTraceIds: [],
      },
      execution: {
        status: 'APPLIED',
        decisionType: input.decisionType,
        decisionPayload: input.decisionPayload,
        terminal: false,
      },
      references: {
        evidenceLinks: input.evidenceLinks ?? [],
        explanationLinks: input.explanationLinks ?? [],
        sourceRecordIds: [],
      },
      warnings: [],
      errors: [],
      trace: {
        traceId,
        executedAt: now,
        durationMilliseconds: 1,
      },
    };
  }
}
