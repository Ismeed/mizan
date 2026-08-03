/**
 * Explanations Routes
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { Router } from 'express';
import { ExplanationsController } from './explanations.controller';

export const explanationsRouter = Router();

explanationsRouter.get('/languages', ExplanationsController.getLanguages);
explanationsRouter.get('/locales', ExplanationsController.getLocales);
explanationsRouter.get('/terminology/:termId', ExplanationsController.getTerminology);
explanationsRouter.get('/explanations/:explanationId', ExplanationsController.getExplanationById);
explanationsRouter.post('/explanations/render', ExplanationsController.renderExplanation);
explanationsRouter.post('/ai/explanation-context', ExplanationsController.getAIExplanationContext);
explanationsRouter.get('/admin/translations/coverage', ExplanationsController.getCoverageReport);
