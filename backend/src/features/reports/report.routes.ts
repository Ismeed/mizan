import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const reportRouter = Router();
const controller = new ReportController();

// Both routes protected by authMiddleware (authenticate)
reportRouter.use(authenticate);

reportRouter.get('/inheritance/:calculationId', controller.getInheritanceReport);
reportRouter.get('/zakat/:calculationId', controller.getZakatReport);

export { reportRouter };
