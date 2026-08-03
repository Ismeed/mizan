/**
 * MIZAN — Calculation Result Repository Service (Phase 13)
 * Persistent storage, retrieval, and append-only immutability checks for results.
 */

import { prisma } from '../../../config/database';
import type { CalculationResultEnvelope } from '@mizan/shared';
import { CalculationResultValidationService } from './calculation-result-validation.service';
import { CalculationResultSnapshotService } from './calculation-result-snapshot.service';

export class CalculationResultRepository {
  static async saveResult(envelope: CalculationResultEnvelope): Promise<string> {
    const validation = CalculationResultValidationService.validateEnvelope(envelope);
    if (!validation.isValid) {
      const err = new Error(`INVALID_RESULT_ENVELOPE: ${validation.errors.map((e) => e.message).join('; ')}`);
      (err as any).statusCode = 422;
      throw err;
    }

    const snapshot = CalculationResultSnapshotService.createSnapshot(envelope);

    await prisma.$transaction(async (tx) => {
      await tx.calculationResultDb.create({
        data: {
          result_id: envelope.resultId,
          calculation_id: envelope.calculationId,
          result_version: envelope.resultVersion,
          result_schema_version: envelope.resultSchemaVersion,
          module: envelope.module,
          status: envelope.status,
          envelope_json: envelope as any,
          result_checksum: envelope.integrity.resultChecksum,
        },
      });

      await tx.calculationResultSnapshotDb.create({
        data: {
          result_snapshot_id: snapshot.resultSnapshotId,
          result_id: snapshot.resultId,
          calculation_id: snapshot.calculationId,
          result_schema_version: snapshot.resultSchemaVersion,
          module: snapshot.module,
          knowledge_release_version: snapshot.knowledgeReleaseVersion,
          rule_engine_version: snapshot.ruleEngineVersion,
          snapshot_checksum: snapshot.snapshotChecksum,
          is_immutable: true,
          snapshot_json: snapshot as any,
        },
      });
    });

    return envelope.resultId;
  }

  static async getByResultId(resultId: string): Promise<CalculationResultEnvelope | null> {
    const record = await prisma.calculationResultDb.findUnique({
      where: { result_id: resultId },
    });

    if (!record) return null;
    const envelope = record.envelope_json as unknown as CalculationResultEnvelope;

    // Verify integrity on retrieval
    const validation = CalculationResultValidationService.validateEnvelope(envelope);
    if (!validation.isValid) {
      envelope.status = 'INTEGRITY_FAILURE';
    }

    return envelope;
  }

  static async getByCalculationId(calculationId: string): Promise<CalculationResultEnvelope | null> {
    const record = await prisma.calculationResultDb.findFirst({
      where: { calculation_id: calculationId },
      orderBy: { created_at: 'desc' },
    });

    if (!record) return null;
    return record.envelope_json as unknown as CalculationResultEnvelope;
  }
}
