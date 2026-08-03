/**
 * MIZAN — Calculation Result Snapshot Service (Phase 13)
 * Freezes immutable calculation result snapshots.
 */

import type { CalculationResultEnvelope, CalculationResultSnapshot } from '@mizan/shared';
import { ResultIntegrityService } from './result-integrity.service';

export class CalculationResultSnapshotService {
  static createSnapshot(envelope: CalculationResultEnvelope): CalculationResultSnapshot {
    const snapshotChecksum = ResultIntegrityService.generateChecksum(envelope);

    return {
      resultSnapshotId: envelope.integrity.resultSnapshotId,
      resultId: envelope.resultId,
      calculationId: envelope.calculationId,
      resultSchemaVersion: envelope.resultSchemaVersion,
      module: envelope.module,
      profileSnapshot: envelope.profile,
      inputSnapshotReferences: envelope.input,
      authoritativeResult: envelope,
      ruleVersions: ['1.0.0'],
      evidenceVersions: ['1.0.0'],
      explanationVersions: ['1.0.0'],
      registryVersions: {
        evidenceRegistryVersion: '1.0.0',
        explanationRegistryVersion: '1.0.0',
        currencyRegistryVersion: '1.0.0',
      },
      knowledgeReleaseVersion: envelope.context.knowledgeReleaseVersion,
      ruleEngineVersion: envelope.context.ruleEngineVersion,
      snapshotChecksum,
      createdAt: envelope.audit.createdAt,
      isImmutable: true,
    };
  }
}
