import { Router } from 'express';
import { KnowledgeAdminController } from './knowledge-admin.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../shared/middleware/admin.middleware';

const router = Router();
const controller = new KnowledgeAdminController();

// Protected admin routes
router.use(authMiddleware, adminMiddleware);

router.post('/records', controller.createDraft.bind(controller));
router.get('/records/:id', controller.getRecord.bind(controller));
router.post('/records/:id/review/academic', controller.submitAcademicReview.bind(controller));
router.post('/records/:id/review/sharia', controller.submitShariaReview.bind(controller));
router.post('/records/:id/review/technical', controller.submitTechnicalReview.bind(controller));
router.post('/records/:id/publish', controller.publish.bind(controller));
router.get('/validation', controller.runValidation.bind(controller));
router.post('/manifests', controller.generateManifest.bind(controller));

export { router as knowledgeAdminRouter };
export default router;
