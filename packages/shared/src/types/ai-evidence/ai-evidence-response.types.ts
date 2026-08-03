/**
 * Structured AI Response Contract & Claims (Phase 16)
 */

export interface AIEvidenceResponseClaim {
  claimId: string;
  claimType:
    | 'SOURCE_DESCRIPTION'
    | 'DECISION_RELATIONSHIP'
    | 'APPROVED_EXPLANATION_PARAPHRASE'
    | 'TERMINOLOGY_CLARIFICATION'
    | 'CALCULATION_VALUE_CLARIFICATION'
    | 'LIMITATION_DISCLOSURE';
  text: string;
  support: Array<{
    supportType: 'EVIDENCE' | 'RULE' | 'EXPLANATION' | 'RESULT_VALUE' | 'TERMINOLOGY_RECORD';
    recordId: string;
    recordVersion: string;
  }>;
  validationStatus: 'PENDING' | 'VALIDATED' | 'REJECTED';
}

export interface AIEvidenceResponse {
  aiResponseId: string;
  responseSchemaVersion: '1.0.0';
  status:
    | 'COMPLETED'
    | 'COMPLETED_WITH_LIMITATIONS'
    | 'INSUFFICIENT_VERIFIED_CONTEXT'
    | 'REFUSED_BY_POLICY'
    | 'INVALID_PROVIDER_RESPONSE';
  language: {
    requestedLanguageTag: string;
    resolvedLanguageTag: string;
    fallbackUsed: boolean;
  };
  content: {
    title: string;
    evidenceReference: string;
    whatTheEvidenceSupports: string;
    approvedExplanationSummary: string;
    aiClarification: string;
    sourceDisclosure: string;
    limitations: string[];
  };
  sourceUsage: {
    evidenceIdsUsed: string[];
    evidenceVersionsUsed: string[];
    explanationIdsUsed: string[];
    ruleIdsUsed: string[];
    retrievedRecordIdsUsed: string[];
  };
  claims: AIEvidenceResponseClaim[];
  suggestedFollowUps: string[];
  integrity: {
    responseChecksum: string;
  };
}
