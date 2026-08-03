/**
 * MIZAN — Livestock Zakat Controller (Phase 9)
 *
 * HTTP handlers for user and admin Livestock Zakat endpoints.
 */

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../../shared/utils/response.utils';
import { LivestockScheduleResolutionService } from './services/livestock-schedule-resolution.service';
import { AILivestockContextService } from './services/ai-livestock-context.service';
import { BASELINE_LIVESTOCK_ANIMAL_TYPES } from '@mizan/shared';
import { BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES } from '@mizan/shared';

const resolver = new LivestockScheduleResolutionService();
const aiContextService = new AILivestockContextService();

export class LivestockController {
  /**
   * GET /api/zakat/livestock/types
   */
  public async getAnimalTypes(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { types: BASELINE_LIVESTOCK_ANIMAL_TYPES });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * GET /api/zakat/livestock/required-facts
   */
  public async getRequiredFacts(req: Request, res: Response): Promise<void> {
    try {
      const { madhhab = 'HANAFI', animalTypeId = 'CATTLE' } = req.query;
      sendSuccess(res, {
        madhhab,
        animalTypeId,
        requiredFields: ['totalCount', 'ownershipDuration', 'feedingMethod', 'purposeClassification'],
        optionalFields: ['ageBreakdown', 'sexBreakdown', 'jointOwnershipShares'],
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/zakat/livestock/preview
   */
  public async previewSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { facts, madhhab = 'HANAFI', calculationId = 'PREVIEW-001' } = req.body;
      if (!facts || typeof facts.herd?.totalCount !== 'number') {
        sendError(res, 'INVALID_FACTS: facts.herd.totalCount is required.', 400);
        return;
      }

      const result = resolver.resolveLivestockSchedule({
        calculationId,
        calculationProfileId: 'PROF-PREVIEW',
        facts,
        madhhab,
      });

      sendSuccess(res, { result });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/ai/livestock-context
   */
  public async getAIContext(req: Request, res: Response): Promise<void> {
    try {
      const { result, calculationId = 'AI-CALC-001', madhhab = 'HANAFI', languageTag = 'en' } = req.body;
      if (!result) {
        sendError(res, 'INVALID_INPUT: result payload required.', 400);
        return;
      }

      const contextPackage = aiContextService.buildContextPackage(
        result,
        calculationId,
        madhhab,
        languageTag
      );

      sendSuccess(res, { contextPackage });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }


  /**
   * GET /api/admin/zakat/livestock/schedules
   */
  public async listAdminSchedules(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { schedules: BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
