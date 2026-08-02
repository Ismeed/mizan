import { Request, Response, NextFunction } from 'express';
import { KnowledgeRecordService } from './services/knowledge-record.service';
import { ReviewWorkflowService } from './services/review-workflow.service';
import { PublicationService } from './services/publication.service';
import { ManifestService } from './services/manifest.service';
import { KnowledgeValidationService } from './services/knowledge-validation.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';
import { GovernanceRole } from './types/knowledge.types';

export class KnowledgeAdminController {
  /**
   * POST /api/admin/knowledge/records — Create draft record
   */
  async createDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const role: GovernanceRole = req.body.actorRole || user?.role || 'RESEARCH_ASSISTANT';
      const record = await KnowledgeRecordService.createDraftRecord(req.body, role);
      sendSuccess(res, record, 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * GET /api/admin/knowledge/records/:id — Get record details
   */
  async getRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await KnowledgeRecordService.getRecord(req.params.id);
      sendSuccess(res, record);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  /**
   * POST /api/admin/knowledge/records/:id/review/academic — Submit Academic Review
   */
  async submitAcademicReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewerId, reviewerRole, status, notes } = req.body;
      const review = await ReviewWorkflowService.submitAcademicReview(
        req.params.id,
        reviewerId,
        reviewerRole,
        status,
        notes
      );
      sendSuccess(res, review);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * POST /api/admin/knowledge/records/:id/review/sharia — Submit Sharia Review
   */
  async submitShariaReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewerId, reviewerRole, status, scholarlyNotes } = req.body;
      const review = await ReviewWorkflowService.submitShariaReview(
        req.params.id,
        reviewerId,
        reviewerRole,
        status,
        scholarlyNotes
      );
      sendSuccess(res, review);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * POST /api/admin/knowledge/records/:id/review/technical — Submit Technical Review
   */
  async submitTechnicalReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewerId, reviewerRole, status, validationLogs } = req.body;
      const review = await ReviewWorkflowService.submitTechnicalReview(
        req.params.id,
        reviewerId,
        reviewerRole,
        status,
        validationLogs
      );
      sendSuccess(res, review);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * POST /api/admin/knowledge/records/:id/publish — Publish to Production
   */
  async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const { publisherId, publisherRole } = req.body;
      const result = await PublicationService.publishToProduction(
        req.params.id,
        publisherId,
        publisherRole
      );
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  /**
   * GET /api/admin/knowledge/validation — Run full integrity validation
   */
  async runValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await KnowledgeValidationService.runFullValidation();
      sendSuccess(res, report);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/admin/knowledge/manifests — Generate release manifest
   */
  async generateManifest(req: Request, res: Response, next: NextFunction) {
    try {
      const { manifestName, module, generatorId } = req.body;
      const manifest = await ManifestService.generateManifest(manifestName, module, generatorId);
      sendSuccess(res, manifest, 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
