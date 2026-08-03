import { Router } from 'express';
import { aiEvidenceController } from './ai-evidence.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../../shared/middleware/admin.middleware';

export const aiEvidenceRouter = Router();
export const adminAiEvidenceRouter = Router();

// User AI Evidence Routes
aiEvidenceRouter.post('/context/build', authMiddleware, aiEvidenceController.buildContext);
aiEvidenceRouter.post('/context/validate', authMiddleware, aiEvidenceController.validateContext);
aiEvidenceRouter.get('/context/:contextSnapshotId', authMiddleware, aiEvidenceController.getContextSnapshot);

aiEvidenceRouter.post('/explain', authMiddleware, aiEvidenceController.explainEvidence);

aiEvidenceRouter.post('/conversations', authMiddleware, aiEvidenceController.startConversation);
aiEvidenceRouter.get('/conversations/:conversationId', authMiddleware, aiEvidenceController.getConversation);
aiEvidenceRouter.post('/conversations/:conversationId/messages', authMiddleware, aiEvidenceController.addMessage);

aiEvidenceRouter.get('/responses/:responseId', authMiddleware, aiEvidenceController.getResponse);
aiEvidenceRouter.post('/responses/:responseId/validate', authMiddleware, aiEvidenceController.validateResponse);
aiEvidenceRouter.get('/requests/:requestId/audit', authMiddleware, aiEvidenceController.getRequestAudit);

// Admin AI Evidence Routes
adminAiEvidenceRouter.get('/evidence/audit', authMiddleware, adminMiddleware, aiEvidenceController.getAdminAudit);
adminAiEvidenceRouter.get('/evidence/validation-failures', authMiddleware, adminMiddleware, aiEvidenceController.getValidationFailures);
