/**
 * MIZAN — Heir Registry Routes (Phase 7)
 *
 * Router definitions for user and admin heir endpoints.
 */

import { Router } from 'express';
import { authenticateToken } from '../../shared/middleware/auth.middleware';
import {
  listSupportedHeirs,
  getHeirEntity,
  normalizeHeirInput,
  checkHeirAvailability,
  listHeirGroups,
  getHeirGroup,
  getDisplaySections,
  validateHeirEntity,
  migrateLegacyLabels,
} from './heirs.controller';

const router = Router();

// All endpoints require authentication
router.use(authenticateToken);

// User-facing endpoints
router.get('/', listSupportedHeirs);
router.get('/display-sections', getDisplaySections);
router.get('/groups', listHeirGroups);
router.get('/groups/:groupId', getHeirGroup);
router.get('/availability', checkHeirAvailability);
router.get('/:heirId', getHeirEntity);
router.post('/normalize', normalizeHeirInput);

// Admin-facing validation endpoints
router.post('/admin/validate', validateHeirEntity);
router.post('/admin/migrate-legacy', migrateLegacyLabels);

export default router;
