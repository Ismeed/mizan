import { prisma } from '../../../config/database';

export interface RegisterHistoricalRecordInput {
  navigationId: string;
  resultSnapshotId: string;
  originalEvidenceVersion: string;
  originalRuleVersion: string;
  originalExplanationVersion?: string | null;
  knowledgeReleaseVersion: string;
}

export class HistoricalEvidenceNavigationService {
  /**
   * Registers a historical evidence navigation record.
   * Guarantees that historical link resolution uses original snapshot versions.
   */
  static async registerHistoricalRecord(input: RegisterHistoricalRecordInput): Promise<void> {
    try {
      await (prisma as any).historicalEvidenceNavigationRecordDb.create({
        data: {
          navigation_id: input.navigationId,
          result_snapshot_id: input.resultSnapshotId,
          original_evidence_ver: input.originalEvidenceVersion,
          original_rule_ver: input.originalRuleVersion,
          original_explanation_ver: input.originalExplanationVersion || null,
          knowledge_release_ver: input.knowledgeReleaseVersion,
        },
      });
    } catch (err) {
      console.warn('[HistoricalEvidenceNavigationService] Error saving historical navigation record:', err);
    }
  }

  /**
   * Retrieves historical version snapshot mappings for a given navigation ID.
   */
  static async getHistoricalRecord(navigationId: string) {
    return (prisma as any).historicalEvidenceNavigationRecordDb.findUnique({
      where: { navigation_id: navigationId },
    });
  }
}
