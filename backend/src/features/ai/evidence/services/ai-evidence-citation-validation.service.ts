import { VerifiedAIEvidenceContextEnvelope, AIEvidenceResponse } from '../../../../../../packages/shared/src';

export interface CitationValidationResult {
  isValid: boolean;
  unsupportedCitations: string[];
}

export class AIEvidenceCitationValidationService {
  /**
   * Validates that all citations used in the response reference records supplied in the context.
   */
  static validate(
    response: AIEvidenceResponse,
    context: VerifiedAIEvidenceContextEnvelope
  ): CitationValidationResult {
    const suppliedEvidenceId = context.evidenceContext.evidenceId;
    const usedEvidenceIds = response.sourceUsage.evidenceIdsUsed || [];

    const unsupportedCitations: string[] = [];

    for (const eId of usedEvidenceIds) {
      if (eId !== suppliedEvidenceId) {
        unsupportedCitations.push(eId);
      }
    }

    return {
      isValid: unsupportedCitations.length === 0,
      unsupportedCitations,
    };
  }
}
