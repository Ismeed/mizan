import { prisma } from '../../../config/database';
import { EvidenceChecksumService } from '../../evidence/services/evidence-checksum.service';

export interface CreateOfflineSnapshotInput {
  navigationId: string;
  calculationId: string;
  resultId: string;
  resultItemId: string;
  evidenceId: string;
  evidenceVersion: string;
  selectedMadhhab: string;
  knowledgeReleaseVersion: string;
  approvedCitation: Record<string, any>;
  approvedExplanation?: Record<string, any> | null;
}

export class OfflineEvidenceNavigationService {
  /**
   * Creates an immutable offline navigation snapshot for offline result viewing.
   */
  static async createOfflineSnapshot(input: CreateOfflineSnapshotInput): Promise<string> {
    const offlineSnapshotId = `OFFLINE-SNAP-${input.navigationId}`;
    const contentChecksum = EvidenceChecksumService.generateContentChecksum({
      navigationId: input.navigationId,
      calculationId: input.calculationId,
      resultItemId: input.resultItemId,
      evidenceId: input.evidenceId,
      evidenceVersion: input.evidenceVersion,
      selectedMadhhab: input.selectedMadhhab,
      citation: input.approvedCitation,
    });

    await (prisma as any).offlineEvidenceNavigationSnapshotDb.upsert({
      where: { offline_snapshot_id: offlineSnapshotId },
      create: {
        offline_snapshot_id: offlineSnapshotId,
        navigation_id: input.navigationId,
        calculation_id: input.calculationId,
        result_id: input.resultId,
        result_item_id: input.resultItemId,
        evidence_id: input.evidenceId,
        evidence_version: input.evidenceVersion,
        selected_madhhab: input.selectedMadhhab,
        knowledge_release_ver: input.knowledgeReleaseVersion,
        content_checksum: contentChecksum,
        approved_citation_json: input.approvedCitation,
        approved_explanation_json: input.approvedExplanation || null,
        is_immutable: true,
      },
      update: {
        last_verified_at: new Date(),
      },
    });

    return offlineSnapshotId;
  }

  /**
   * Retrieves an offline snapshot by ID and verifies checksum.
   */
  static async getVerifiedOfflineSnapshot(offlineSnapshotId: string) {
    const snap = await (prisma as any).offlineEvidenceNavigationSnapshotDb.findUnique({
      where: { offline_snapshot_id: offlineSnapshotId },
    });

    if (!snap) return null;

    const expectedChecksum = EvidenceChecksumService.generateContentChecksum({
      navigationId: snap.navigation_id,
      calculationId: snap.calculation_id,
      resultItemId: snap.result_item_id,
      evidenceId: snap.evidence_id,
      evidenceVersion: snap.evidence_version,
      selectedMadhhab: snap.selected_madhhab,
      citation: snap.approved_citation_json,
    });

    if (snap.content_checksum !== expectedChecksum) {
      console.warn(`[OfflineEvidenceNavigationService] Checksum mismatch on snapshot ${offlineSnapshotId}`);
      return null; // Integrity failure
    }

    return snap;
  }
}
