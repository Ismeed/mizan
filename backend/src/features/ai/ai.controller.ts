import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

const service = new AIService();

export const aiController = {
  /**
   * POST /api/ai/chat
   * Send a message and receive an AI response.
   */
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user ? (req as any).user.userId : 'anonymous_user';
      const { content, conversationId, history, contextData } = req.body;

      if (!content || typeof content !== 'string' || !content.trim()) {
        return sendError(res, 'Message content is required', 400);
      }

      const response = await service.chat({
        userId,
        content: content.trim(),
        conversationId,
        history,
        contextData,
      });

      sendSuccess(res, response);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/conversations
   */
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      sendSuccess(res, await service.getConversations(userId));
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/conversations/:id/messages
   */
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      sendSuccess(res, await service.getMessages(id, userId));
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/ai/conversations/:id
   */
  async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      await service.deleteConversation(id, userId);
      sendSuccess(res, { message: 'Conversation deleted' });
    } catch (err) {
      next(err);
    }
  },
};
