import { prisma } from '../../../config/database';
import { GovernanceRole } from '../types/knowledge.types';
import { KnowledgeRecordService } from './knowledge-record.service';
import { ChecksumService } from './checksum.service';

export class ReviewWorkflowService {
  /**
   * Submits an Academic Review log.
   */
  static async submitAcademicReview(
    knowledgeId: string,
    reviewerId: string,
    reviewerRole: GovernanceRole,
    status: 'PASSED' | 'CHANGES_REQUESTED' | 'REJECTED',
    notes: string
  ) {
    if (!['ACADEMIC_REVIEWER', 'KNOWLEDGE_ADMIN'].includes(reviewerRole)) {
      throw new Error(`Role '${reviewerRole}' is not authorized to submit Academic Reviews.`);
    }

    const record = await KnowledgeRecordService.getRecord(knowledgeId);
    if (record.status !== 'ACADEMIC_REVIEW') {
      throw new Error(`Record '${knowledgeId}' is not in ACADEMIC_REVIEW status (Current: ${record.status}).`);
    }

    // Separation of duties: Creator cannot be the reviewer
    if (record.created_by === reviewerId) {
      throw new Error('Separation of duties violation: Record creator cannot review their own submission.');
    }

    const review = await prisma.academicReview.create({
      data: {
        knowledge_id: knowledgeId,
        reviewer_id: reviewerId,
        status,
        notes,
      },
    });

    if (status === 'PASSED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'SHARIA_REVIEW', reviewerId, reviewerRole, notes);
    } else if (status === 'CHANGES_REQUESTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'CHANGES_REQUESTED', reviewerId, reviewerRole, notes);
    } else if (status === 'REJECTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'REJECTED', reviewerId, reviewerRole, notes);
    }

    return review;
  }

  /**
   * Submits a Sharia Review log.
   */
  static async submitShariaReview(
    knowledgeId: string,
    reviewerId: string,
    reviewerRole: GovernanceRole,
    status: 'PASSED' | 'CHANGES_REQUESTED' | 'REJECTED',
    scholarlyNotes: string
  ) {
    if (!['SHARIA_REVIEWER', 'KNOWLEDGE_ADMIN'].includes(reviewerRole)) {
      throw new Error(`Role '${reviewerRole}' is not authorized to submit Sharia Reviews.`);
    }

    const record = await KnowledgeRecordService.getRecord(knowledgeId);
    if (record.status !== 'SHARIA_REVIEW') {
      throw new Error(`Record '${knowledgeId}' is not in SHARIA_REVIEW status (Current: ${record.status}).`);
    }

    if (record.created_by === reviewerId) {
      throw new Error('Separation of duties violation: Record creator cannot give Sharia approval.');
    }

    const review = await prisma.shariaReview.create({
      data: {
        knowledge_id: knowledgeId,
        reviewer_id: reviewerId,
        status,
        scholarly_notes: scholarlyNotes,
      },
    });

    if (status === 'PASSED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'TECHNICAL_VALIDATION', reviewerId, reviewerRole, scholarlyNotes);
    } else if (status === 'CHANGES_REQUESTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'CHANGES_REQUESTED', reviewerId, reviewerRole, scholarlyNotes);
    } else if (status === 'REJECTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'REJECTED', reviewerId, reviewerRole, scholarlyNotes);
    }

    return review;
  }

  /**
   * Submits a Technical Review log and grants final APPROVED status if passed.
   */
  static async submitTechnicalReview(
    knowledgeId: string,
    reviewerId: string,
    reviewerRole: GovernanceRole,
    status: 'PASSED' | 'CHANGES_REQUESTED' | 'REJECTED',
    validationLogs: string
  ) {
    if (!['TECHNICAL_REVIEWER', 'KNOWLEDGE_ADMIN'].includes(reviewerRole)) {
      throw new Error(`Role '${reviewerRole}' is not authorized to submit Technical Reviews.`);
    }

    const record = await KnowledgeRecordService.getRecord(knowledgeId);
    if (record.status !== 'TECHNICAL_VALIDATION') {
      throw new Error(`Record '${knowledgeId}' is not in TECHNICAL_VALIDATION status (Current: ${record.status}).`);
    }

    const review = await prisma.technicalReview.create({
      data: {
        knowledge_id: knowledgeId,
        reviewer_id: reviewerId,
        status,
        validation_logs: validationLogs,
      },
    });

    if (status === 'PASSED') {
      // Create Approval Record
      await prisma.approvalRecord.create({
        data: {
          knowledge_id: knowledgeId,
          approver_id: reviewerId,
          version: record.version,
          content_checksum: record.content_checksum,
          effective_date: new Date(),
          comments: validationLogs,
        },
      });

      await KnowledgeRecordService.transitionStatus(knowledgeId, 'APPROVED', reviewerId, reviewerRole, validationLogs);
    } else if (status === 'CHANGES_REQUESTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'CHANGES_REQUESTED', reviewerId, reviewerRole, validationLogs);
    } else if (status === 'REJECTED') {
      await KnowledgeRecordService.transitionStatus(knowledgeId, 'REJECTED', reviewerId, reviewerRole, validationLogs);
    }

    return review;
  }
}
