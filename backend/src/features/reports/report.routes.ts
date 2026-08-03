/**
 * MIZAN — Report Routes (Phase 14)
 */

import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const reportRouter = Router();
const controller = new ReportController();

reportRouter.use(authenticate);

reportRouter.get('/inheritance/:calculationId', (req, res) => controller.getInheritanceReport(req, res));
reportRouter.get('/zakat/:calculationId', (req, res) => controller.getZakatReport(req, res));
reportRouter.get('/calculation/:calculationId/envelope', (req, res) => controller.getReportEnvelope(req, res));
reportRouter.get('/calculation/:calculationId/ai-context', (req, res) => controller.getAIReportContext(req, res));

export { reportRouter };
