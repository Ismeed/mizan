import { Router } from 'express';
import { SupportController } from './support.controller';

const router = Router();
const controller = new SupportController();

// Submit problem report / feedback (POST /api/support/feedback)
router.post('/feedback', controller.submitFeedback.bind(controller));

export { router as supportRouter };
