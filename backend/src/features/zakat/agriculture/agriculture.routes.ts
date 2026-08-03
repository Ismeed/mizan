/**
 * MIZAN — Agriculture Zakat Routes (Phase 10)
 */

import { Router } from 'express';
import { AgricultureController } from './agriculture.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();
const controller = new AgricultureController();

// ── User Endpoints ─────────────────────────────────────────────────────────
router.get('/produce-types', (req, res) => controller.getProduceTypes(req, res));
router.get('/required-facts', (req, res) => controller.getRequiredFacts(req, res));
router.post('/preview', (req, res) => controller.previewSchedule(req, res));
router.post('/aggregate', (req, res) => controller.aggregateHarvests(req, res));

// Protected preview/AI context
router.post('/ai-context', authMiddleware, (req, res) => controller.getAIContext(req, res));

// ── Admin Endpoints ────────────────────────────────────────────────────────
router.get('/admin/nisab-records', authMiddleware, (req, res) => controller.listAdminNisab(req, res));
router.get('/admin/rate-records', authMiddleware, (req, res) => controller.listAdminRates(req, res));
router.get('/admin/aggregation-policies', authMiddleware, (req, res) => controller.listAdminAggregationPolicies(req, res));
router.get('/admin/measurement-units', authMiddleware, (req, res) => controller.listAdminMeasurementUnits(req, res));

export default router;
