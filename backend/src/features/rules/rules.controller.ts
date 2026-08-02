/**
 * MIZAN — Canonical Rule Standard Admin Controller
 *
 * Provides REST endpoints for rule management, import, export, validation, and conflict detection.
 */

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';
import { RuleValidatorService } from './services/rule-validator.service';
import { RuleImportService } from './services/rule-import.service';
import { RuleExportService } from './services/rule-export.service';
import { RuleRegistryService } from './services/rule-registry.service';
import { RuleConflictDetectorService } from './services/rule-conflict-detector.service';
import { prisma } from '../../config/database';

export class RulesAdminController {
  /**
   * GET /api/admin/rules
   * Lists rule records with optional filtering.
   */
  static async listRules(req: Request, res: Response): Promise<void> {
    try {
      const { module, madhhab, status, releaseVersion, limit = '50', page = '1' } = req.query;
      const take = parseInt(limit as string, 10);
      const skip = (parseInt(page as string, 10) - 1) * take;

      const where: any = {};
      if (module) where.module = module as string;
      if (status) where.status = status as string;
      if (releaseVersion) where.knowledge_release_version = releaseVersion as string;

      const [records, total] = await Promise.all([
        (prisma as any).ruleRecord.findMany({
          where,
          take,
          skip,
          orderBy: [{ rule_id: 'asc' }, { rule_version: 'desc' }],
        }),
        (prisma as any).ruleRecord.count({ where }),
      ]);

      sendSuccess(res, {
        rules: records,
        pagination: {
          total,
          page: parseInt(page as string, 10),
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * GET /api/admin/rules/:ruleId
   * Gets a specific rule record by ruleId.
   */
  static async getRuleById(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;
      const { version } = req.query;

      const where: any = { rule_id: ruleId };
      if (version) where.rule_version = version as string;

      const record = await (prisma as any).ruleRecord.findFirst({
        where,
        orderBy: { rule_version: 'desc' },
      });

      if (!record) {
        sendError(res, `Rule record not found for ID "${ruleId}"`, 404);
        return;
      }

      sendSuccess(res, record);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * POST /api/admin/rules/import
   * Imports rule JSON objects.
   */
  static async importRules(req: Request, res: Response): Promise<void> {
    try {
      const { rules, importSource = 'ADMIN_UI', allowOverwriteDraft = false } = req.body;

      if (!Array.isArray(rules) || rules.length === 0) {
        sendError(res, 'Request body must contain a non-empty "rules" array.', 400);
        return;
      }

      const importedBy = (req as any).user?.id || 'ADMIN_USER';

      const report = await RuleImportService.importRules(rules, {
        importedBy,
        importSource,
        allowOverwriteDraft,
      });

      const statusCode = report.status === 'COMPLETE' ? 200 : report.status === 'PARTIAL' ? 207 : 400;
      sendSuccess(res, report, statusCode);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * POST /api/admin/rules/export
   * Exports rule records as a verified JSON bundle.
   */
  static async exportRules(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.body || {};
      const exportedBy = (req as any).user?.id || 'ADMIN_USER';

      const bundle = await RuleExportService.exportRules(filter, exportedBy);
      sendSuccess(res, bundle);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * POST /api/admin/rules/validate
   * Validates a rule JSON object without persisting it.
   */
  static async validateRule(req: Request, res: Response): Promise<void> {
    try {
      const rule = req.body;
      if (!rule || !rule.identity) {
        sendError(res, 'Invalid request body: expected CanonicalRule object.', 400);
        return;
      }

      const report = RuleValidatorService.validate(rule);
      sendSuccess(res, report);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * GET /api/admin/rules/conflicts
   * Scans candidate rules for declared or registered conflicts.
   */
  static async checkConflicts(req: Request, res: Response): Promise<void> {
    try {
      const { module = 'MIRATH', madhhab = 'HANAFI', releaseVersion = '1.0.0' } = req.query;

      const registryResult = await RuleRegistryService.getRulesForContext({
        module: module as any,
        madhhab: madhhab as string,
        knowledgeReleaseVersion: releaseVersion as string,
        includeTestFixtures: true,
      });

      const report = await RuleConflictDetectorService.detectConflicts(registryResult.rules);
      sendSuccess(res, report);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * GET /api/admin/rules/resolution/audit/:calculationId
   * Retrieves the immutable Madhhab resolution audit record for a calculation.
   */
  static async getResolutionAudit(req: Request, res: Response): Promise<void> {
    try {
      const { calculationId } = req.params;
      const record = await (prisma as any).madhhabResolutionAudit.findFirst({
        where: { calculation_id: calculationId },
      });

      if (!record) {
        sendError(res, `Resolution audit not found for calculationId "${calculationId}"`, 404);
        return;
      }

      sendSuccess(res, record);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }

  /**
   * POST /api/admin/rules/resolution/simulate
   * Dry-run simulation of Madhhab-specific rule resolution.
   */
  static async simulateResolution(req: Request, res: Response): Promise<void> {
    try {
      const { candidateRules, facts, madhhab = 'HANAFI' } = req.body;

      if (!Array.isArray(candidateRules) || !facts) {
        sendError(res, 'Request body must contain "candidateRules" array and "facts" object.', 400);
        return;
      }

      const { MadhhabResolutionService } = await import('./services/madhhab-resolution.service');
      const output = await MadhhabResolutionService.resolveForMadhhab({
        candidateRules,
        facts,
        madhhab,
      });

      sendSuccess(res, output);
    } catch (err) {
      sendError(res, err instanceof Error ? err.message : String(err), 500);
    }
  }
}

