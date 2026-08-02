/**
 * MIZAN — Hijab Audit Service (Phase 6)
 *
 * Writes immutable HijabResolutionAudit records and associated rule links.
 * Records are written once per calculation execution and never modified.
 *
 * The audit trail supports:
 * - Knowledge auditing
 * - Scholar review
 * - Rule traceability
 * - Calculation report generation
 */

import { prisma } from '../../../config/database';
import type { HijabResolutionAuditInput } from '@mizan/shared';

export class HijabAuditService {
  /**
   * Writes an immutable HijabResolutionAudit record to the database.
   * Also creates HijabResolutionAuditRuleLink records for each applied rule.
   */
  static async writeAudit(input: HijabResolutionAuditInput): Promise<void> {
    try {
      // Create the main audit record
      const auditRecord = await (prisma as any).hijabResolutionAudit.create({
        data: {
          calculation_id:         input.calculationId,
          madhhab:                input.madhhab,
          profile_id:             input.profileId,
          present_heirs_json:     input.presentHeirsJson,
          rules_evaluated_count:  input.rulesEvaluatedCount,
          rules_applied_count:    input.rulesAppliedCount,
          heir_statuses_json:     input.heirStatusesJson,
          resolution_trace_json:  input.resolutionTraceJson,
          has_partial_resolution: input.hasPartialResolution,
        },
      });

      // Create rule links for each applied rule
      const appliedStatuses = input.heirStatusesJson.filter(
        (s) => s.appliedHijabRuleId !== undefined
      );

      for (const status of appliedStatuses) {
        if (!status.appliedHijabRuleId) continue;

        // Look up the HijabRule database record by its permanent ID
        const hijabRuleDb = await (prisma as any).hijabRule.findUnique({
          where: { hijab_rule_id: status.appliedHijabRuleId },
          select: { id: true },
        });

        if (!hijabRuleDb) {
          console.warn(
            `[HijabAuditService] HijabRule not found in DB: ${status.appliedHijabRuleId}`
          );
          continue;
        }

        await (prisma as any).hijabResolutionAuditRuleLink.upsert({
          where: {
            audit_id_hijab_rule_db_id: {
              audit_id: auditRecord.id,
              hijab_rule_db_id: hijabRuleDb.id,
            },
          },
          create: {
            audit_id:         auditRecord.id,
            hijab_rule_db_id: hijabRuleDb.id,
            was_applied:      true,
            blocked_heir_key: status.heirKey,
            effect_type:      status.effectType ?? 'HIRMAN',
          },
          update: {},
        });
      }
    } catch (err) {
      // Audit failures must NEVER crash a calculation
      console.error('[HijabAuditService] Audit write failed:', err);
    }
  }

  /**
   * Retrieves the audit history for a given calculation.
   */
  static async getAuditForCalculation(calculationId: string): Promise<unknown[]> {
    try {
      return await (prisma as any).hijabResolutionAudit.findMany({
        where: { calculation_id: calculationId },
        include: { ruleLinks: { include: { hijabRule: true } } },
        orderBy: { resolved_at: 'desc' },
      });
    } catch (err) {
      console.error('[HijabAuditService] Audit fetch failed:', err);
      return [];
    }
  }

  /**
   * Retrieves audit records for a given madhhab (for governance reporting).
   */
  static async getAuditsByMadhhab(
    madhhab: string,
    limit = 100,
    offset = 0
  ): Promise<unknown[]> {
    try {
      return await (prisma as any).hijabResolutionAudit.findMany({
        where: { madhhab },
        orderBy: { resolved_at: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (err) {
      console.error('[HijabAuditService] Audit fetch by madhhab failed:', err);
      return [];
    }
  }
}
