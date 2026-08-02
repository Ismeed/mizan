import { Router } from 'express';
import { EvidenceController } from './evidence.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../shared/middleware/admin.middleware';

export const evidenceRouter = Router();
export const adminEvidenceRouter = Router();

// Public / Authenticated user endpoints
evidenceRouter.get('/:evidenceId', authMiddleware, EvidenceController.getEvidenceById);
evidenceRouter.post('/ai-context', authMiddleware, EvidenceController.getAIEvidenceContext);

// Admin-only endpoints
adminEvidenceRouter.post('/import', adminMiddleware, EvidenceController.importEvidence);
adminEvidenceRouter.get('/export', adminMiddleware, EvidenceController.exportEvidence);
adminEvidenceRouter.post('/link-rule', adminMiddleware, EvidenceController.linkRule);
