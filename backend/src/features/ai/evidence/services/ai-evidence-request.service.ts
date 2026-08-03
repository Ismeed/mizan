import { AIEvidenceRequest, VerifiedAIEvidenceContextEnvelope } from '../../../../../../packages/shared/src';
import { AIEvidenceSigningService } from './ai-evidence-signing.service';

export interface BuildAIRequestInput {
  contextSnapshotId: string;
  context: VerifiedAIEvidenceContextEnvelope;
  userQuestionText: string;
  userLanguageTag?: string;
}

export class AIEvidenceRequestService {
  /**
   * Constructs a provider-neutral AIEvidenceRequest from a verified context snapshot.
   */
  static buildRequest(input: BuildAIRequestInput): AIEvidenceRequest {
    const requestId = 'REQ-AI-' + Math.random().toString(36).substring(2, 10);
    const lang = input.userLanguageTag || input.context.localizationContext.resolvedLanguageTag || 'en';

    const reqPayload = {
      aiRequestId: requestId,
      task: 'EXPLAIN_VERIFIED_EVIDENCE' as const,
      contextSnapshotId: input.contextSnapshotId,
      promptPolicy: {
        policyId: 'AI-EVIDENCE-SYSTEM-POLICY-001',
        policyVersion: '1.0.0',
      },
      promptTemplate: {
        templateId: 'AI-EVIDENCE-EXPLANATION-001',
        templateVersion: '1.0.0',
      },
      userQuestion: {
        text: input.userQuestionText,
        languageTag: lang,
      },
      responseSchema: {
        schemaId: 'AI-EVIDENCE-RESPONSE-001',
        schemaVersion: '1.0.0',
      },
      providerPreference: {
        providerId: 'GEMINI' as const,
        modelPolicyId: 'GEMINI-EVIDENCE-MODEL-POLICY-001',
      },
    };

    const checksum = AIEvidenceSigningService.generateChecksum(reqPayload);

    return {
      ...reqPayload,
      requestChecksum: checksum,
    };
  }
}
