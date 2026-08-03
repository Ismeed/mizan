import crypto from 'crypto';
import { prisma } from '../../../../config/database';

export interface RecordRequestAuditInput {
  requestId: string;
  contextSnapshotId: string;
  userId: string;
  providerId: string;
  modelIdentifier: string;
  promptPolicyVer: string;
  promptTemplateVer: string;
  userQuestion: string;
  contextChecksum: string;
  requestChecksum: string;
  providerResponseId?: string;
  responseChecksum?: string;
  schemaValid: boolean;
  groundingValid: boolean;
  quotationValid: boolean;
  displayStatus: string;
  errorCode?: string;
}

export class AIEvidenceAuditService {
  /**
   * Logs a complete audit record for an AI model request.
   */
  static async recordRequestAudit(input: RecordRequestAuditInput) {
    const questionHash = crypto.createHash('sha256').update(input.userQuestion).digest('hex');

    return prisma.aIEvidenceRequestAuditDb.create({
      data: {
        ai_request_id: input.requestId,
        context_snapshot_id: input.contextSnapshotId,
        user_id: input.userId,
        provider_id: input.providerId,
        model_identifier: input.modelIdentifier,
        prompt_policy_ver: input.promptPolicyVer,
        prompt_template_ver: input.promptTemplateVer,
        user_question_hash: questionHash,
        context_checksum: input.contextChecksum,
        request_checksum: input.requestChecksum,
        provider_response_id: input.providerResponseId || null,
        response_checksum: input.responseChecksum || null,
        schema_valid: input.schemaValid,
        grounding_valid: input.groundingValid,
        quotation_valid: input.quotationValid,
        display_status: input.displayStatus,
        error_code: input.errorCode || null,
      },
    });
  }
}
