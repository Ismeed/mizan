import { Router } from 'express';
import { knowledgeAdminController } from './knowledge.controller';

const router = Router();

router.get('/documents', knowledgeAdminController.getDocuments);
router.post('/documents', knowledgeAdminController.uploadDocument);
router.get('/metrics', knowledgeAdminController.getMetrics);

export const knowledgeAdminRouter = router;
