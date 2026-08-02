/**
 * MIZAN — Zakat Category Registry API Controller (Phase 8)
 *
 * Handles HTTP requests for the canonical Zakat category registry.
 * Returns category metadata — NOT zakatable status or rate decisions.
 */

import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';
import { ZakatCategoryRegistryService } from './services/zakat-category-registry.service';
import { ZakatLocalizationService } from './services/zakat-localization.service';
import { ZakatNormalizationService } from './services/zakat-normalization.service';
import { ZakatCategoryAvailabilityService } from './services/zakat-category-availability.service';
import { ZakatDisplayService } from './services/zakat-display.service';
import type { CanonicalZakatCategoryId, SupportedZakatLanguage } from '@mizan/shared';

const registrySvc      = new ZakatCategoryRegistryService();
const localizationSvc  = new ZakatLocalizationService();
const normalizationSvc = new ZakatNormalizationService();
const availabilitySvc  = new ZakatCategoryAvailabilityService();
const displaySvc       = new ZakatDisplayService();

export class ZakatCategoriesController {

  /**
   * GET /api/zakat/categories
   * List all canonical Zakat categories for a given madhhab.
   */
  async listCategories(req: Request, res: Response): Promise<void> {
    try {
      const madhhab  = (req.query.madhhab as string) ?? 'HANAFI';
      const language = ((req.query.language as string) ?? 'en') as SupportedZakatLanguage;
      const excludeLiabilities = req.query.excludeLiabilities === 'true';

      const categories = registrySvc.listCategories({ madhhab, excludeLiabilities });
      const localizedCategories = localizationSvc.listLocalizedCategories(
        categories.map(c => c.categoryId),
        language,
      );

      sendSuccess(res, {
        categories: localizedCategories.map((lc, i) => ({
          ...categories[i],
          labelSet: lc.labelSet,
        })),
        totalCount: categories.length,
        madhhab,
        language,
      });
    } catch (err: any) {
      sendError(res, err.message ?? 'Failed to list Zakat categories', 500);
    }
  }

  /**
   * GET /api/zakat/categories/:categoryId
   * Get a single canonical Zakat category entity.
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const language = ((req.query.language as string) ?? 'en') as SupportedZakatLanguage;

      const entity = registrySvc.findCategoryById(categoryId as CanonicalZakatCategoryId);
      if (!entity) {
        sendError(res, `Category not found: ${categoryId}`, 404);
        return;
      }

      const labelSet = localizationSvc.getLocalizedLabelSet(entity.categoryId, language);

      sendSuccess(res, { entity, labelSet, language });
    } catch (err: any) {
      sendError(res, err.message ?? 'Failed to get Zakat category', 500);
    }
  }

  /**
   * GET /api/zakat/categories/form-sections
   * Get ordered, localized form sections for the Zakat input UI.
   */
  async getFormSections(req: Request, res: Response): Promise<void> {
    try {
      const madhhab  = (req.query.madhhab as string) ?? 'HANAFI';
      const language = ((req.query.language as string) ?? 'en') as SupportedZakatLanguage;
      const includeLiabilities = req.query.includeLiabilities !== 'false';

      const sections = displaySvc.buildZakatInputSections(madhhab, language, {
        includeLiabilities,
        includeReviewRequired: true,
      });

      sendSuccess(res, { sections, madhhab, language });
    } catch (err: any) {
      sendError(res, err.message ?? 'Failed to get Zakat form sections', 500);
    }
  }

  /**
   * POST /api/zakat/categories/normalize
   * Normalize a raw user-entered Zakat category term to a canonical ID.
   */
  async normalizeCategoryInput(req: Request, res: Response): Promise<void> {
    try {
      const { rawInput, madhhab = 'HANAFI', languageTag = 'en' } = req.body;

      if (!rawInput || typeof rawInput !== 'string') {
        sendError(res, 'rawInput is required and must be a string', 400);
        return;
      }

      const result = normalizationSvc.normalizeCategoryInput({
        rawInput,
        madhhab,
        languageTag,
      });

      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message ?? 'Normalization failed', 500);
    }
  }

  /**
   * GET /api/zakat/categories/:categoryId/availability
   * Check the input availability of a category for a given madhhab.
   */
  async getCategoryAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const madhhab = (req.query.madhhab as string) ?? 'HANAFI';

      const result = availabilitySvc.getAvailability({
        categoryId: categoryId as CanonicalZakatCategoryId,
        madhhab,
      });

      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message ?? 'Availability check failed', 500);
    }
  }

  /**
   * POST /api/zakat/categories/migrate-legacy
   * Migrate a legacy AssetType value to a canonical category ID.
   * Admin and migration tool use only.
   */
  async migrateLegacyAssetType(req: Request, res: Response): Promise<void> {
    try {
      const { legacyValue } = req.body;

      if (!legacyValue || typeof legacyValue !== 'string') {
        sendError(res, 'legacyValue is required and must be a string', 400);
        return;
      }

      const result = normalizationSvc.migrateLegacyAssetType(legacyValue);
      sendSuccess(res, result);
    } catch (err: any) {
      sendError(res, err.message ?? 'Migration failed', 500);
    }
  }
}
