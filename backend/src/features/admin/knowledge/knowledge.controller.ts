import { Request, Response, NextFunction } from 'express';
import { KnowledgeManagementService } from './knowledge.service';
import { sendSuccess, sendError } from '../../../shared/utils/response.utils';

export const knowledgeAdminController = {
  async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await KnowledgeManagementService.getDocuments();
      sendSuccess(res, docs);
    } catch (err) {
      next(err);
    }
  },

  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { sourceName, category, title, content, madhhab, version } = req.body;
      if (!sourceName || !title || !content) {
        return sendError(res, 'Missing required document fields', 400);
      }
      const doc = await KnowledgeManagementService.uploadDocument({
        sourceName,
        category: category || 'FIQH_BOOK',
        title,
        content,
        madhhab: madhhab || 'ALL',
        version: version || '1.0.0',
        isApproved: true,
      });
      sendSuccess(res, doc, 201);
    } catch (err) {
      next(err);
    }
  },

  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await KnowledgeManagementService.getRetrievalMetrics();
      sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  },
};
