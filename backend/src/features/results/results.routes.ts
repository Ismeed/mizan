/**
 * MIZAN — Calculation Results Routes (Phase 13)
 * Registers endpoints for standard calculation result envelopes.
 */

import { Router } from 'express';
import { ResultsController } from './results.controller';

export const resultsRouter = Router();

resultsRouter.get('/results/:resultId', ResultsController.getResult);
resultsRouter.get('/calculations/:calculationId/result', ResultsController.getResultByCalculationId);
resultsRouter.get('/results/:resultId/items', ResultsController.getResultItems);
resultsRouter.get('/results/:resultId/items/:resultItemId', ResultsController.getResultItemById);
resultsRouter.post('/results/:resultId/render', ResultsController.renderResult);
resultsRouter.get('/results/:resultId/export', ResultsController.exportResult);
resultsRouter.get('/results/:resultId/ai-context', ResultsController.getAIContext);
