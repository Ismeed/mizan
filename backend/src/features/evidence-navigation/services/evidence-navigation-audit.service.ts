import { prisma } from '../../../config/database';

export interface AuditEventInput {
  navigationId: string;
  userId?: string | null;
  calculationId?: string | null;
  resultId?: string | null;
  resultItemId?: string | null;
  reportId?: string | null;
  evidenceId: string;
  evidenceVersion: string;
  ruleId?: string | null;
  selectedMadhhab: string;
  action: string;
  originType: string;
  validationStatus: string;
  accessDenialReason?: string | null;
  aiContextSnapshotId?: string | null;
}

export interface InjectionLogInput {
  navigationId?: string | null;
  userId?: string | null;
  attemptedInput: string;
  blockedReason: string;
  ipAddress?: string | null;
}

export class EvidenceNavigationAuditService {
  /**
   * Logs a navigation audit event.
   */
  static async logEvent(input: AuditEventInput): Promise<void> {
    try {
      await (prisma as any).evidenceNavigationAuditEventDb.create({
        data: {
          navigation_id: input.navigationId,
          user_id: input.userId || null,
          calculation_id: input.calculationId || null,
          result_id: input.resultId || null,
          result_item_id: input.resultItemId || null,
          report_id: input.reportId || null,
          evidence_id: input.evidenceId,
          evidence_version: input.evidenceVersion,
          rule_id: input.ruleId || null,
          selected_madhhab: input.selectedMadhhab,
          action: input.action,
          origin_type: input.originType,
          validation_status: input.validationStatus,
          access_denial_reason: input.accessDenialReason || null,
          ai_context_snapshot_id: input.aiContextSnapshotId || null,
        },
      });
    } catch (err) {
      console.warn('[EvidenceNavigationAuditService] Error logging audit event:', err);
    }
  }

  /**
   * Logs a prompt injection attempt.
   */
  static async logInjectionAttempt(input: InjectionLogInput): Promise<void> {
    try {
      await (prisma as any).navigationInjectionAttemptLogDb.create({
        data: {
          navigation_id: input.navigationId || null,
          user_id: input.userId || null,
          attempted_input: input.attemptedInput.slice(0, 2000), // sanitize length
          blocked_reason: input.blockedReason,
          ip_address: input.ipAddress || null,
        },
      });
    } catch (err) {
      console.warn('[EvidenceNavigationAuditService] Error logging injection attempt:', err);
    }
  }
}
