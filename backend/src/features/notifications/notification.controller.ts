import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { sendSuccess } from '../../shared/utils/response.utils';

const service = new NotificationService();

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const page   = parseInt(req.query.page as string) || 1;
      const limit  = parseInt(req.query.limit as string) || 20;
      sendSuccess(res, await service.getNotifications(userId, page, limit));
    } catch (err) { next(err); }
  },

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      await service.markRead(req.params.id, userId);
      sendSuccess(res, { message: 'Notification marked as read' });
    } catch (err) { next(err); }
  },

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      await service.markAllRead(userId);
      sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (err) { next(err); }
  },

  async registerToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { fcmToken, platform } = req.body;
      sendSuccess(res, await service.registerDeviceToken(userId, fcmToken, platform));
    } catch (err) { next(err); }
  },
};
