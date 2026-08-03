import { Router } from 'express';
import { EvidenceNavigationController } from './evidence-navigation.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../shared/middleware/admin.middleware';

export const evidenceNavigationRouter = Router();
export const adminEvidenceNavigationRouter = Router();

// Public / Authenticated user endpoints
evidenceNavigationRouter.post('/build', authMiddleware, EvidenceNavigationController.buildPayload);
evidenceNavigationRouter.post('/validate', authMiddleware, EvidenceNavigationController.validatePayload);
evidenceNavigationRouter.post('/hydrate', authMiddleware, EvidenceNavigationController.hydratePayload);
evidenceNavigationRouter.post('/preview', authMiddleware, EvidenceNavigationController.getPreview);
evidenceNavigationRouter.post('/open-ai', authMiddleware, EvidenceNavigationController.openAIEvidenceConversation);
evidenceNavigationRouter.get('/reader/:evidenceId', authMiddleware, EvidenceNavigationController.openEvidenceReader);
evidenceNavigationRouter.post('/tokens', authMiddleware, EvidenceNavigationController.createToken);
evidenceNavigationRouter.get('/token/:token', authMiddleware, EvidenceNavigationController.resolveToken);
evidenceNavigationRouter.post('/tokens/:tokenId/revoke', authMiddleware, EvidenceNavigationController.revokeToken);
evidenceNavigationRouter.get('/context/:contextSnapshotId', authMiddleware, EvidenceNavigationController.getContextSnapshot);

// Admin-only endpoints
adminEvidenceNavigationRouter.get('/audit', adminMiddleware, EvidenceNavigationController.getAuditEvents);
