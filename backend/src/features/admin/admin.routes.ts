import { Router } from 'express';
import { AdminController } from './admin.controller';
import { adminMiddleware } from '../../shared/middleware/admin.middleware';

const router = Router();
const controller = new AdminController();

// Apply admin middleware to all routes in this router
router.use(adminMiddleware);

// Dashboard
router.get('/stats', controller.getDashboardStats.bind(controller));

// Users
router.get('/users', controller.getUsers.bind(controller));
router.get('/users/:id', controller.getUserById.bind(controller));
router.patch('/users/:id/premium', controller.toggleUserPremium.bind(controller));
router.delete('/users/:id', controller.deleteUser.bind(controller));

// Analytics
router.get('/analytics/trends', controller.getCalculationTrends.bind(controller));

// Notifications (Broadcast & Targeted Push)
router.post('/broadcast', controller.broadcastNotification.bind(controller));
router.post('/notify-user', controller.notifyUser.bind(controller));

// User Problem Reports / Support Feedback
router.get('/feedback', controller.getReportedProblems.bind(controller));

// FAQs
router.get('/faqs', controller.getFAQs.bind(controller));
router.post('/faqs', controller.createFAQ.bind(controller));
router.delete('/faqs/:id', controller.deleteFAQ.bind(controller));

export { router as adminRouter };
