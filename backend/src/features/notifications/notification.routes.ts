import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get('/',              notificationController.getNotifications);
notificationRouter.patch('/:id/read',    notificationController.markRead);
notificationRouter.patch('/read-all',    notificationController.markAllRead);
notificationRouter.post('/register-token', notificationController.registerToken);
