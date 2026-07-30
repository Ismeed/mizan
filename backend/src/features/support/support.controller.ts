import { Request, Response } from 'express';
import { SupportService } from './support.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

const supportService = new SupportService();

export class SupportController {
  async submitFeedback(req: Request, res: Response) {
    try {
      const { category, subject, description } = req.body;
      const user = (req as any).user;

      if (!subject || !description) {
        return sendError(res, 'Subject and description are required', 400);
      }

      const feedback = await supportService.submitFeedback({
        category,
        subject,
        description,
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
      });

      return sendSuccess(res, feedback, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to submit problem report', 500);
    }
  }
}
