import { prisma } from '../../../../config/database';
import { AIEvidenceResponse } from '../../../../../../packages/shared/src';
import { GroundingValidationResult } from './ai-evidence-response-grounding.service';
import { AIEvidenceSigningService } from './ai-evidence-signing.service';

export class AIEvidenceResponseSnapshotService {
  /**
   * Creates an immutable AI Response Snapshot in DB after grounding validation.
   */
  static async createSnapshot(
    response: AIEvidenceResponse,
    requestId: string,
    contextSnapshotId: string,
    groundingResult: GroundingValidationResult
  ): Promise<string> {
    const snapshotId = 'SNAPSHOT-AI-RESP-' + Math.random().toString(36).substring(2, 10);
    const checksum = AIEvidenceSigningService.generateChecksum(response);

    await prisma.aIEvidenceResponseSnapshotDb.create({
      data: {
        ai_response_snapshot_id: snapshotId,
        ai_request_id: requestId,
        ai_context_snapshot_id: contextSnapshotId,
        provider_id: 'GEMINI',
        model_identifier: 'gemini-1.5-pro',
        raw_provider_ref: null,
        validated_response_json: JSON.parse(JSON.stringify(response)),
        validation_results_json: JSON.parse(JSON.stringify(groundingResult)),
        response_checksum: checksum,
        is_immutable: true,
      },
    });

    return snapshotId;
  }
}
