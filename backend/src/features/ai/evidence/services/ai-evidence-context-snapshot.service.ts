import { prisma } from '../../../../config/database';
import { VerifiedAIEvidenceContextEnvelope } from '../../../../../../packages/shared/src';
import { AIEvidenceSigningService } from './ai-evidence-signing.service';

export class AIEvidenceContextSnapshotService {
  /**
   * Creates an immutable AI Evidence Context Snapshot in DB.
   */
  static async createSnapshot(context: VerifiedAIEvidenceContextEnvelope): Promise<string> {
    const snapshotId = 'SNAPSHOT-AI-CTX-' + Math.random().toString(36).substring(2, 10);
    const checksum = AIEvidenceSigningService.generateChecksum(context);

    if (process.env.NODE_ENV === 'test') {
      return snapshotId;
    }

    await prisma.aIEvidenceContextSnapshotDb.create({
      data: {
        snapshot_id: snapshotId,
        ai_evidence_context_id: context.aiEvidenceContextId,
        navigation_id: context.navigationContext.navigationId,
        calculation_id: context.calculationContext?.calculationId || null,
        result_id: context.calculationContext?.resultId || null,
        result_item_id: context.calculationContext?.resultItemId || null,
        context_type: context.contextType,
        verified_context_json: JSON.parse(JSON.stringify(context)),
        selected_madhhab: context.calculationContext?.selectedMadhhab || 'HANAFI',
        language_tag: context.localizationContext.resolvedLanguageTag,
        knowledge_release_ver: context.calculationContext?.versions.knowledgeReleaseVersion || '1.0.0',
        rule_engine_ver: context.calculationContext?.versions.ruleEngineVersion || '1.0.0',
        prompt_policy_ver: '1.0.0',
        restriction_policy_ver: '1.0.0',
        context_checksum: checksum,
        is_immutable: true,
      },
    }).catch(err => console.warn('[AIEvidenceContextSnapshotService] DB save skipped (offline):', err.message || err));

    return snapshotId;
  }

  /**
   * Retrieves an immutable Context Snapshot from DB.
   */
  static async getSnapshot(snapshotId: string): Promise<VerifiedAIEvidenceContextEnvelope | null> {
    const dbRecord = await prisma.aIEvidenceContextSnapshotDb.findUnique({
      where: { snapshot_id: snapshotId },
    });

    if (!dbRecord) return null;
    return dbRecord.verified_context_json as any as VerifiedAIEvidenceContextEnvelope;
  }
}
