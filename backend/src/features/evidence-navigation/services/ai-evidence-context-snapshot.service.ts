import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { AIEvidenceContextV2, AIEvidenceContextSnapshot } from '../../../../../packages/shared/src';

export class AIEvidenceContextSnapshotService {
  /**
   * Creates an immutable AI Context Snapshot record in DB.
   */
  static async createSnapshot(context: AIEvidenceContextV2): Promise<AIEvidenceContextSnapshot> {
    const snapshotId = `AI-SNAP-${crypto.randomUUID()}`;

    const snapshot: AIEvidenceContextSnapshot = {
      aiContextSnapshotId: snapshotId,
      navigationId: context.navigation.navigationId,
      calculationId: context.calculationContext?.calculationId || null,
      resultId: context.calculationContext?.resultId || null,
      resultItemId: context.calculationContext?.resultItemId || null,
      contextPayload: context,
      selectedMadhhab: context.calculationContext?.selectedMadhhab || 'HANAFI',
      languageTag: context.calculationContext?.languageTag || 'en',
      knowledgeReleaseVersion: context.calculationContext?.knowledgeReleaseVersion || '1.0.0',
      ruleEngineVersion: context.calculationContext?.ruleEngineVersion || '1.0.0',
      restrictions: context.restrictions,
      contextChecksum: context.integrity.contextChecksum,
      createdAt: new Date().toISOString(),
      isImmutable: true,
    };

    await (prisma as any).aIEvidenceContextSnapshotDb.create({
      data: {
        ai_context_snapshot_id: snapshotId,
        navigation_id: context.navigation.navigationId,
        calculation_id: context.calculationContext?.calculationId || null,
        result_id: context.calculationContext?.resultId || null,
        result_item_id: context.calculationContext?.resultItemId || null,
        selected_madhhab: context.calculationContext?.selectedMadhhab || 'HANAFI',
        language_tag: context.calculationContext?.languageTag || 'en',
        knowledge_release_version: context.calculationContext?.knowledgeReleaseVersion || '1.0.0',
        rule_engine_version: context.calculationContext?.ruleEngineVersion || '1.0.0',
        context_checksum: context.integrity.contextChecksum,
        context_payload_json: context as any,
        restrictions_json: context.restrictions as any,
        is_immutable: true,
      },
    });

    return snapshot;
  }

  /**
   * Retrieves an immutable snapshot by snapshot ID.
   */
  static async getSnapshot(snapshotId: string): Promise<AIEvidenceContextSnapshot | null> {
    const rec = await (prisma as any).aIEvidenceContextSnapshotDb.findUnique({
      where: { ai_context_snapshot_id: snapshotId },
    });

    if (!rec) return null;

    return {
      aiContextSnapshotId: rec.ai_context_snapshot_id,
      navigationId: rec.navigation_id,
      calculationId: rec.calculation_id,
      resultId: rec.result_id,
      resultItemId: rec.result_item_id,
      contextPayload: rec.context_payload_json as any,
      selectedMadhhab: rec.selected_madhhab,
      languageTag: rec.language_tag,
      knowledgeReleaseVersion: rec.knowledge_release_version,
      ruleEngineVersion: rec.rule_engine_version,
      restrictions: rec.restrictions_json as any,
      contextChecksum: rec.context_checksum,
      createdAt: rec.created_at.toISOString(),
      isImmutable: rec.is_immutable,
    };
  }
}
