/**
 * MIZAN — Hijab Controller (Phase 6)
 *
 * HTTP handler for the Hijab Rule System API endpoints.
 * All endpoints are authenticated. Rule mutation endpoints require ADMIN role.
 */

import { Request, Response } from 'express';
import { HijabResolverService } from '../rules/services/hijab-resolver.service';
import { HijabAuditService } from '../rules/services/hijab-audit.service';
import { HijabRuleRegistryService } from '../rules/services/hijab-rule-registry.service';
import { HijabExplanationService } from '../rules/services/hijab-explanation.service';
import { HijabRuleRecordSchema } from '@mizan/shared';

// ─── POST /api/hijab/resolve ──────────────────────────────────────────────────

export async function resolveHijab(req: Request, res: Response): Promise<void> {
  try {
    const {
      madhhab,
      presentHeirs,
      heirAttributes,
      calculationId,
      profileId,
      allowTestFixtures,
    } = req.body;

    if (!madhhab || !presentHeirs) {
      res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'madhhab and presentHeirs are required',
      });
      return;
    }

    const output = await HijabResolverService.resolve(
      { madhhab, presentHeirs, heirAttributes, calculationId, profileId },
      allowTestFixtures === true && (req as any).user?.role === 'ADMIN'
    );

    res.status(200).json(output);
  } catch (err: any) {
    console.error('[HijabController.resolveHijab]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── GET /api/hijab/rules ──────────────────────────────────────────────────────

export async function listHijabRules(req: Request, res: Response): Promise<void> {
  try {
    const madhhab = (req.query.madhhab as string) || 'HANAFI';
    const allowTestFixtures =
      req.query.allowTestFixtures === 'true' && (req as any).user?.role === 'ADMIN';

    const rules = await HijabRuleRegistryService.loadRulesForMadhhab(madhhab, allowTestFixtures);
    res.status(200).json({ madhhab, count: rules.length, rules });
  } catch (err: any) {
    console.error('[HijabController.listHijabRules]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── GET /api/hijab/rules/:hijabRuleId ────────────────────────────────────────

export async function getHijabRule(req: Request, res: Response): Promise<void> {
  try {
    const { hijabRuleId } = req.params;
    const version = (req.query.version as string) || '1.0.0';

    const rule = await HijabRuleRegistryService.loadByIdAndVersion(hijabRuleId, version);
    if (!rule) {
      res.status(404).json({ error: 'NOT_FOUND', message: `HijabRule ${hijabRuleId} v${version} not found` });
      return;
    }

    res.status(200).json(rule);
  } catch (err: any) {
    console.error('[HijabController.getHijabRule]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── GET /api/hijab/audit/:calculationId ─────────────────────────────────────

export async function getHijabAudit(req: Request, res: Response): Promise<void> {
  try {
    const { calculationId } = req.params;
    const records = await HijabAuditService.getAuditForCalculation(calculationId);
    res.status(200).json({ calculationId, records });
  } catch (err: any) {
    console.error('[HijabController.getHijabAudit]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── POST /api/hijab/explain ──────────────────────────────────────────────────

export async function explainHijabDecisions(req: Request, res: Response): Promise<void> {
  try {
    const { heirStatuses, madhhab, languageCode, audienceType } = req.body;

    if (!heirStatuses || !madhhab) {
      res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'heirStatuses and madhhab are required',
      });
      return;
    }

    const rules = await HijabRuleRegistryService.loadRulesForMadhhab(madhhab);
    const explanations = await HijabExplanationService.buildExplanations(
      heirStatuses,
      rules,
      languageCode || 'en',
      audienceType || 'GENERAL_USER'
    );

    res.status(200).json({ explanations });
  } catch (err: any) {
    console.error('[HijabController.explainHijabDecisions]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}

// ─── POST /api/hijab/rules/validate ──────────────────────────────────────────

export async function validateHijabRule(req: Request, res: Response): Promise<void> {
  try {
    const result = HijabRuleRecordSchema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({
        error: 'SCHEMA_VALIDATION_FAILED',
        issues: result.error.issues,
      });
      return;
    }
    res.status(200).json({ valid: true, parsed: result.data });
  } catch (err: any) {
    console.error('[HijabController.validateHijabRule]', err);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
}
