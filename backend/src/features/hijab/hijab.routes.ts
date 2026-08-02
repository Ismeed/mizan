/**
 * MIZAN — Hijab Routes (Phase 6)
 *
 * Registers all Hijab Rule System API endpoints.
 * All routes require authentication. Admin-only routes are explicitly noted.
 */

import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth.middleware';
import {
  resolveHijab,
  listHijabRules,
  getHijabRule,
  getHijabAudit,
  explainHijabDecisions,
  validateHijabRule,
} from './hijab.controller';

const router = Router();

// All hijab routes require authentication
router.use(authenticateToken);

// ─── Resolution ────────────────────────────────────────────────────────────────
/** Resolve hijab blocking for a set of heirs under a given madhhab */
router.post('/resolve', resolveHijab);

// ─── Rule Registry ─────────────────────────────────────────────────────────────
/** List all PRODUCTION hijab rules for a madhhab */
router.get('/rules', listHijabRules);
/** Get a specific hijab rule by ID and version */
router.get('/rules/:hijabRuleId', getHijabRule);
/** Validate a hijab rule record against the Zod schema */
router.post('/rules/validate', validateHijabRule);

// ─── Explanations ──────────────────────────────────────────────────────────────
/** Generate multilingual explanations for a set of heir statuses */
router.post('/explain', explainHijabDecisions);

// ─── Audit ─────────────────────────────────────────────────────────────────────
/** Retrieve hijab resolution audit records for a calculation */
router.get('/audit/:calculationId', getHijabAudit);

export default router;
