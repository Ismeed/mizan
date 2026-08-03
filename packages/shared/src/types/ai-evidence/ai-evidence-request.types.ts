/**
 * Provider-Neutral AI Request Contract (Phase 16)
 */

export interface AIEvidenceRequest {
  aiRequestId: string;
  task: 'EXPLAIN_VERIFIED_EVIDENCE';
  contextSnapshotId: string;
  promptPolicy: {
    policyId: string;
    policyVersion: string;
  };
  promptTemplate: {
    templateId: string;
    templateVersion: string;
  };
  userQuestion: {
    text: string;
    languageTag: string;
  };
  responseSchema: {
    schemaId: string;
    schemaVersion: string;
  };
  providerPreference: {
    providerId: 'GEMINI';
    modelPolicyId: string;
  };
  requestChecksum: string;
}
