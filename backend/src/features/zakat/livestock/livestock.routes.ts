/**
 * MIZAN — Livestock Zakat Routes (Phase 9)
 *
 * User and admin endpoints for livestock calculations and schedule preview.
 */

import { Router } from 'express';
import { LivestockController } from './livestock.controller';
import { authenticateToken } from '../../../shared/middleware/auth.middleware';

const router = Router();
const ctrl = new LivestockController();

// All routes require authentication
router.use(authenticateToken);

// ── User Routes ────────────────────────────────────────────────────────────────

/** GET /api/zakat/livestock/types */
router.get('/types', (req, res) => ctrl.getAnimalTypes(req, res));

/** GET /api/zakat/livestock/required-facts */
router.get('/required-facts', (req, res) => ctrl.getRequiredFacts(req, res));

/** POST /api/zakat/livestock/preview */
router.post('/preview', (req, res) => ctrl.previewSchedule(req, res));

/** POST /api/zakat/livestock/ai-context */
router.post('/ai-context', (req, res) => ctrl.getAIContext(req, res));

// ── Admin Routes ───────────────────────────────────────────────────────────────

/** GET /api/zakat/livestock/admin/schedules */
router.get('/admin/schedules', (req, res) => ctrl.listAdminSchedules(req, res));

export default router;
