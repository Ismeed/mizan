/**
 * MIZAN — Agriculture Zakat Controller (Phase 10)
 *
 * HTTP handlers for user and admin Agriculture Zakat endpoints.
 */

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../../shared/utils/response.utils';
import { AgricultureScheduleResolutionService } from './services/agriculture-schedule-resolution.service';
import { AIAgricultureContextService } from './services/ai-agriculture-context.service';
import { AgricultureProduceRegistryService } from './services/agriculture-produce-registry.service';
import { AgricultureAggregationService } from './services/agriculture-aggregation.service';
import {
  BASELINE_SYNTHETIC_AGRICULTURE_NISAB,
  BASELINE_SYNTHETIC_AGRICULTURE_RATES,
  BASELINE_SYNTHETIC_AGRICULTURE_AGGREGATION_POLICIES,
  BASELINE_AGRICULTURE_MEASUREMENT_UNITS,
} from '@mizan/shared';

const resolver = new AgricultureScheduleResolutionService();
const aiContextService = new AIAgricultureContextService();
const produceRegistry = new AgricultureProduceRegistryService();
const aggregationService = new AgricultureAggregationService();

export class AgricultureController {
  /**
   * GET /api/zakat/agriculture/produce-types
   */
  public async getProduceTypes(req: Request, res: Response): Promise<void> {
    try {
      const produceTypes = produceRegistry.listProduceTypes();
      sendSuccess(res, { produceTypes });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * GET /api/zakat/agriculture/required-facts
   */
  public async getRequiredFacts(req: Request, res: Response): Promise<void> {
    try {
      const { madhhab = 'HANAFI', produceTypeId = 'WHEAT' } = req.query;
      sendSuccess(res, {
        madhhab,
        produceTypeId,
        requiredFields: ['produceTypeId', 'quantity', 'quantityUnit', 'irrigationMethod', 'harvestDate'],
        optionalFields: ['qualityGrade', 'ownershipShare', 'mixedIrrigationFraction'],
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/zakat/agriculture/preview
   */
  public async previewSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { facts, madhhab = 'HANAFI', calculationId = 'PREVIEW-AGRI-001' } = req.body;
      if (!facts || !facts.produceTypeId || !facts.harvest) {
        sendError(res, 'INVALID_FACTS: facts payload with produceTypeId and harvest is required.', 400);
        return;
      }

      const { result, trace } = resolver.resolveAgriculture({
        calculationId,
        facts,
        madhhab,
      });

      sendSuccess(res, { result, trace });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/zakat/agriculture/aggregate
   */
  public async aggregateHarvests(req: Request, res: Response): Promise<void> {
    try {
      const { harvestFacts, madhhab = 'HANAFI' } = req.body;
      if (!Array.isArray(harvestFacts)) {
        sendError(res, 'INVALID_INPUT: harvestFacts must be an array.', 400);
        return;
      }

      const aggregatedResult = aggregationService.aggregateHarvests(harvestFacts, madhhab);
      sendSuccess(res, { aggregatedResult });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * POST /api/ai/agriculture-context
   */
  public async getAIContext(req: Request, res: Response): Promise<void> {
    try {
      const { result, calculationId = 'AI-CALC-AGRI-001', madhhab = 'HANAFI', languageTag = 'en' } = req.body;
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
   * GET /api/admin/zakat/agriculture/nisab-records
   */
  public async listAdminNisab(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { nisabRecords: BASELINE_SYNTHETIC_AGRICULTURE_NISAB });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * GET /api/admin/zakat/agriculture/rate-records
   */
  public async listAdminRates(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { rateRecords: BASELINE_SYNTHETIC_AGRICULTURE_RATES });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * GET /api/admin/zakat/agriculture/aggregation-policies
   */
  public async listAdminAggregationPolicies(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { aggregationPolicies: BASELINE_SYNTHETIC_AGRICULTURE_AGGREGATION_POLICIES });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * GET /api/admin/zakat/agriculture/measurement-units
   */
  public async listAdminMeasurementUnits(req: Request, res: Response): Promise<void> {
    try {
      sendSuccess(res, { measurementUnits: BASELINE_AGRICULTURE_MEASUREMENT_UNITS });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
