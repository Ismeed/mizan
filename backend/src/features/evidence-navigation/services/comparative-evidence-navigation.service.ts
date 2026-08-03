import crypto from 'crypto';
import { prisma } from '../../../config/database';
import {
  ComparativeEvidenceNavigationPayload,
  EvidenceNavigationAction,
  EvidenceNavigationOriginType,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface BuildComparativePayloadInput {
  comparisonRecordId: string;
  comparisonRecordVersion?: string;
  topic: string;
  primaryMadhhab: string;
  requestedComparisonMadhhabs: string[];
  evidenceIdsByMadhhab: Record<string, string[]>;
}

export class ComparativeEvidenceNavigationService {
  /**
   * Validates if an approved comparative record exists and builds payload.
   */
  static async buildComparativePayload(input: BuildComparativePayloadInput): Promise<ComparativeEvidenceNavigationPayload | null> {
    // 1. Verify comparative record in DB
    const dbRecord = await (prisma as any).comparativeEvidenceNavigationRecordDb.findUnique({
      where: { comparison_record_id: input.comparisonRecordId },
    });

    if (!dbRecord) {
      console.warn(`[ComparativeEvidenceNavigationService] Comparative record '${input.comparisonRecordId}' not found`);
      return null;
    }

    const navId = `NAV-COMPARE-${crypto.randomUUID()}`;

    const rawPayload: ComparativeEvidenceNavigationPayload = {
      navigationId: navId,
      payloadVersion: '1.0.0',
      action: EvidenceNavigationAction.OPEN_COMPARATIVE_MADHHAB_EVIDENCE,
      origin: {
        originType: EvidenceNavigationOriginType.RULE_DETAILS,
        screenId: 'COMPARATIVE_MADHHAB_VIEW',
      },
      comparison: {
        comparisonRecordId: dbRecord.comparison_record_id,
        comparisonRecordVersion: dbRecord.comparison_version || '1.0.0',
        topic: dbRecord.topic,
        primaryMadhhab: dbRecord.primary_madhhab,
        requestedComparisonMadhhabs: dbRecord.compared_madhhabs_json as string[],
      },
      evidence: {
        evidenceIdsByMadhhab: dbRecord.evidence_map_json as Record<string, string[]>,
      },
      versions: {
        knowledgeReleaseVersion: '1.0.0',
      },
      security: {
        issuedAt: new Date().toISOString(),
        payloadChecksum: '',
      },
    };

    const checksum = EvidenceNavigationSigningService.generatePayloadChecksum(rawPayload);
    const signature = EvidenceNavigationSigningService.generateSignature(checksum, navId);

    rawPayload.security.payloadChecksum = checksum;
    rawPayload.security.signature = signature;

    return rawPayload;
  }
}
