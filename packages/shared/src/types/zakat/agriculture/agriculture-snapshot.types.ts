/**
 * MIZAN — Agriculture Snapshot & Trace Contracts (Phase 10)
 */

export interface AgricultureExecutionStep {
  sequence: number;
  stepName: string;
  action: string;
  result: string;
  appliedRuleId?: string;
  details?: Record<string, unknown>;
}

export interface AgricultureExecutionTrace {
  traceId: string;
  calculationId: string;
  assetInstanceId: string;
  steps: AgricultureExecutionStep[];
  startedAt: string;
  completedAt: string;
}

export interface AgricultureResolutionSnapshot {
  snapshotId: string;
  calculationId: string;
  assetInstanceId: string;
  produceTypeId: string;
  produceTypeVersion: string;
  nisabRecordId: string;
  nisabRecordVersion: string;
  rateRecordId: string;
  rateRecordVersion: string;
  appliedMadhhab: string;
  inputChecksum: string;
  resultChecksum: string;
  createdAt: string;
}
