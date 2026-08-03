/**
 * MIZAN — Immutable Livestock Resolution Snapshot and Execution Trace (Phase 9)
 *
 * Guarantees complete calculation auditability across versions.
 */

export interface LivestockExecutionStep {
  sequence: number;
  action: string;
  result: string;
  bandId?: string;
  patternId?: string;
  obligationDefinitionId?: string;
  appliedRuleIds?: string[];
  details?: Record<string, unknown>;
}

export interface LivestockExecutionTrace {
  traceId: string;
  calculationId: string;
  assetInstanceId: string;
  steps: LivestockExecutionStep[];
  executedAt: string;
}

export interface LivestockResolutionSnapshot {
  snapshotId: string;
  calculationId: string;
  calculationProfileId: string;
  assetInstanceId: string;
  selectedMadhhab: string;
  inputFactsChecksum: string;
  eligibilityRules: Array<{ ruleId: string; version: string }>;
  resolvedSchedule: {
    scheduleId: string;
    scheduleVersion: string;
    baseScheduleId: string;
    overrideIds: string[];
    parallelBranchId?: string | null;
  };
  matchedComponents: {
    bandId?: string | null;
    patternId?: string | null;
    combinationRuleIds: string[];
    remainderRuleId?: string | null;
  };
  resolvedObligation: {
    obligationDefinitionId: string;
    version: string;
    obligationType: string;
  };
  evidenceVersions: Array<{ evidenceId: string; version: string }>;
  explanationVersions: Array<{ explanationId: string; version: string }>;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  resolutionChecksum: string;
  createdAt: string;
  isImmutable: true;
}
