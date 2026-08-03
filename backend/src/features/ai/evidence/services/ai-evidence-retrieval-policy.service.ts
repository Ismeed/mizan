import { AIEvidenceRetrievalMode } from '../../../../../../packages/shared/src';

export class AIEvidenceRetrievalPolicyService {
  /**
   * Validates if a requested retrieval mode is allowed for the given context binding.
   */
  static isRetrievalModePermitted(
    mode: AIEvidenceRetrievalMode,
    binding: 'CALCULATION_BOUND' | 'REPORT_BOUND' | 'STANDALONE_EVIDENCE' | 'COMPARATIVE_CONTEXT' | 'SCHOLAR_REVIEW_CONTEXT'
  ): boolean {
    if (mode === 'NO_ADDITIONAL_RETRIEVAL') return true;

    if (binding === 'CALCULATION_BOUND') {
      return (
        mode === 'RELATED_APPROVED_EXPLANATIONS' ||
        mode === 'RELATED_APPROVED_TERMINOLOGY' ||
        mode === 'RELATED_APPROVED_EVIDENCE'
      );
    }

    if (binding === 'COMPARATIVE_CONTEXT') {
      return mode === 'APPROVED_COMPARATIVE_RECORD_ONLY';
    }

    if (binding === 'STANDALONE_EVIDENCE') {
      return mode === 'RELATED_APPROVED_EXPLANATIONS' || mode === 'RELATED_APPROVED_TERMINOLOGY';
    }

    return mode === 'NO_ADDITIONAL_RETRIEVAL';
  }
}
