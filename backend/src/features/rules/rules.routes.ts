/**
 * MIZAN — Canonical Rule Standard Admin Routes
 */

import { Router } from 'express';
import { RulesAdminController } from './rules.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { adminMiddleware } from '../../shared/middleware/admin.middleware';

const router = Router();

// Protect all rule management endpoints with auth + admin role check
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', RulesAdminController.listRules);
router.get('/conflicts', RulesAdminController.checkConflicts);
router.get('/resolution/audit/:calculationId', RulesAdminController.getResolutionAudit);
router.post('/resolution/simulate', RulesAdminController.simulateResolution);
router.get('/:ruleId', RulesAdminController.getRuleById);
router.post('/import', RulesAdminController.importRules);
router.post('/export', RulesAdminController.exportRules);
router.post('/validate', RulesAdminController.validateRule);

export const rulesAdminRouter = router;

