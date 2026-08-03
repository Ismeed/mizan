/**
 * MIZAN — Calculation Result Snapshot Contract (Phase 13)
 * Immutable snapshot structure for persisting completed results.
 */

import type { CalculationResultEnvelope } from './calculation-result-envelope.types';

export interface CalculationResultSnapshot {
  resultSnapshotId: string;
  resultId: string;
  calculationId: string;
  resultSchemaVersion: string;
  module: 'MIRATH' | 'ZAKAT';
  profileSnapshot: CalculationResultEnvelope['profile'];
  inputSnapshotReferences: CalculationResultEnvelope['input'];
  authoritativeResult: CalculationResultEnvelope;
  ruleVersions: string[];
  evidenceVersions: string[];
  explanationVersions: string[];
  registryVersions: Record<string, string>;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  snapshotChecksum: string;
  createdAt: string;
  isImmutable: boolean;
}
