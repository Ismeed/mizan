import { Router } from 'express';
import { aiController } from './ai.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { rateLimitMiddleware } from '../../shared/middleware/rate-limit.middleware';

export const aiRouter = Router();

// All AI routes require authentication
aiRouter.use(authMiddleware);

// Rate-limit chat endpoint to prevent abuse (20 requests/min)
aiRouter.post('/chat', rateLimitMiddleware(20, 60), aiController.chat);

aiRouter.get('/conversations',              aiController.getConversations);
aiRouter.get('/conversations/:id/messages', aiController.getMessages);
aiRouter.delete('/conversations/:id',       aiController.deleteConversation);
