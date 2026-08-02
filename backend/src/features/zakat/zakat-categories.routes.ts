/**
 * MIZAN — Zakat Category Registry Routes (Phase 8)
 *
 * User-facing routes for the canonical Zakat Category Registry.
 * All routes return category METADATA — not zakatable status.
 */

import { Router } from 'express';
import { ZakatCategoriesController } from './zakat-categories.controller';
import { authenticateToken } from '../../shared/middleware/auth.middleware';

const router = Router();
const ctrl = new ZakatCategoriesController();

// All endpoints require authentication
router.use(authenticateToken);

// ── User Routes ────────────────────────────────────────────────────────────────

/**
 * GET /api/zakat/categories
 * List all canonical Zakat categories for a given madhhab.
 * Query params: madhhab, language, excludeLiabilities
 */
router.get('/', (req, res) => ctrl.listCategories(req, res));

/**
 * GET /api/zakat/categories/form-sections
 * Get ordered, localized form sections for the Zakat input UI.
 * Query params: madhhab, language, includeLiabilities
 * NOTE: This route must come before /:categoryId to avoid route conflict.
 */
router.get('/form-sections', (req, res) => ctrl.getFormSections(req, res));

/**
 * POST /api/zakat/categories/normalize
 * Normalize a raw user-entered Zakat category term to a canonical ID.
 * Body: { rawInput: string, madhhab?: string, languageTag?: string }
 */
router.post('/normalize', (req, res) => ctrl.normalizeCategoryInput(req, res));

/**
 * POST /api/zakat/categories/migrate-legacy
 * Migrate a legacy AssetType value to a canonical category ID.
 * Body: { legacyValue: string }
 */
router.post('/migrate-legacy', (req, res) => ctrl.migrateLegacyAssetType(req, res));

/**
 * GET /api/zakat/categories/:categoryId
 * Get a single canonical Zakat category entity.
 * Query params: language
 */
router.get('/:categoryId', (req, res) => ctrl.getCategoryById(req, res));

/**
 * GET /api/zakat/categories/:categoryId/availability
 * Check the input availability of a category for a given madhhab.
 * Query params: madhhab
 */
router.get('/:categoryId/availability', (req, res) => ctrl.getCategoryAvailability(req, res));

export default router;
