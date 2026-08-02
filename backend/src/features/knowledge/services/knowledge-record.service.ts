import { prisma } from '../../../config/database';
import { ChecksumService } from './checksum.service';
import { TransitionGuardService } from './transition-guard.service';
import { SourceProvenanceService } from './provenance.service';
import { BaseKnowledgeRecordPayload, GovernanceRole, KnowledgeStatus } from '../types/knowledge.types';

export class KnowledgeRecordService {
  /**
   * Creates a new KnowledgeRecord in DRAFT status.
   */
  static async createDraftRecord(
    payload: Omit<BaseKnowledgeRecordPayload, 'status' | 'version' | 'contentChecksum' | 'createdAt' | 'updatedAt'>,
    creatorRole: GovernanceRole
  ) {
    if (!['RESEARCH_ASSISTANT', 'DATA_EDITOR', 'KNOWLEDGE_ADMIN'].includes(creatorRole)) {
      throw new Error(`Role '${creatorRole}' is not authorized to create knowledge records.`);
    }

    const provenanceVal = SourceProvenanceService.validateProvenance(payload.sourceProvenance);
    if (!provenanceVal.valid) {
      throw new Error(`Source provenance validation failed: ${provenanceVal.errors.join('; ')}`);
    }

    const version = '1.0.0';
    const status: KnowledgeStatus = 'DRAFT';

    const fullPayload: BaseKnowledgeRecordPayload = {
      ...payload,
      status,
      version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentChecksum: '',
    };

    const checksum = ChecksumService.generateRecordChecksum(fullPayload);
    fullPayload.contentChecksum = checksum;

    const record = await prisma.knowledgeRecord.create({
      data: {
        knowledge_id: payload.knowledgeId,
        record_type: payload.recordType,
        module: payload.module,
        topic: payload.topic,
        subtopic: payload.subtopic,
        status,
        version,
        source_provenance_json: JSON.stringify(payload.sourceProvenance),
        evidence_ids_json: JSON.stringify(payload.evidenceIds || []),
        related_rule_ids_json: JSON.stringify(payload.relatedRuleIds || []),
        related_explanation_ids: JSON.stringify(payload.relatedExplanationIds || []),
        madhhab_scope_json: JSON.stringify(payload.madhhabScope || []),
        language_scope_json: JSON.stringify(payload.languageScope || []),
        content_json: JSON.stringify(payload.contentData || {}),
        content_checksum: checksum,
        created_by: payload.createdBy,
        updated_by: payload.updatedBy,
      },
    });

    // Save initial version snapshot
    await prisma.knowledgeVersion.create({
      data: {
        knowledge_id: record.knowledge_id,
        version,
        status,
        content_checksum: checksum,
        payload_json: JSON.stringify(fullPayload),
        created_by: payload.createdBy,
      },
    });

    // Record audit event
    await prisma.knowledgeAuditEvent.create({
      data: {
        knowledge_id: record.knowledge_id,
        actor_id: payload.createdBy,
        actor_role: creatorRole,
        action: 'CREATE_DRAFT',
        new_status: 'DRAFT',
        version,
        new_checksum: checksum,
        reason: 'Initial record draft creation.',
      },
    });

    return record;
  }

  /**
   * Retrieves a knowledge record by knowledgeId.
   */
  static async getRecord(knowledgeId: string) {
    const record = await prisma.knowledgeRecord.findUnique({
      where: { knowledge_id: knowledgeId },
      include: {
        versions: true,
        assignments: true,
        academic_reviews: true,
        sharia_reviews: true,
        technical_reviews: true,
        approvals: true,
        change_requests: true,
        rejections: true,
        publications: true,
        indexing_records: true,
        audit_events: true,
      },
    });

    if (!record) {
      throw new Error(`KnowledgeRecord with ID '${knowledgeId}' not found.`);
    }

    return record;
  }

  /**
   * Transitions a record's lifecycle status cleanly with guard enforcement.
   */
  static async transitionStatus(
    knowledgeId: string,
    targetStatus: KnowledgeStatus,
    actorId: string,
    actorRole: GovernanceRole,
    reason?: string
  ) {
    const record = await this.getRecord(knowledgeId);
    const currentStatus = record.status as KnowledgeStatus;

    // Reject transitions on immutable statuses unless approved
    if (['APPROVED', 'INDEXED', 'PRODUCTION'].includes(currentStatus) && ['DRAFT', 'ACADEMIC_REVIEW'].includes(targetStatus)) {
      throw new Error(`Cannot revert immutable status '${currentStatus}' back to '${targetStatus}'. Create a new version instead.`);
    }

    const guard = TransitionGuardService.validateTransition(currentStatus, targetStatus, actorRole, reason);
    if (!guard.allowed) {
      throw new Error(guard.reason);
    }

    const updatedRecord = await prisma.knowledgeRecord.update({
      where: { knowledge_id: knowledgeId },
      data: {
        status: targetStatus,
        updated_by: actorId,
      },
    });

    // Append to audit trail
    await prisma.knowledgeAuditEvent.create({
      data: {
        knowledge_id: knowledgeId,
        actor_id: actorId,
        actor_role: actorRole,
        action: `TRANSITION_${currentStatus}_TO_${targetStatus}`,
        old_status: currentStatus,
        new_status: targetStatus,
        version: record.version,
        previous_checksum: record.content_checksum,
        new_checksum: record.content_checksum,
        reason: reason || `Status updated from ${currentStatus} to ${targetStatus}`,
      },
    });

    return updatedRecord;
  }
}
