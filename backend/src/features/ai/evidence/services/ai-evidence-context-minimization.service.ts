import { VerifiedAIEvidenceContextEnvelope } from '../../../../../../packages/shared/src';

export interface MinimizationResult {
  originalSizeBytes: number;
  minimizedSizeBytes: number;
  removedFields: string[];
  minimizedContext: VerifiedAIEvidenceContextEnvelope;
}

export class AIEvidenceContextMinimizationService {
  /**
   * Minimizes the Verified Context Envelope without removing authoritative meaning,
   * permanent identifiers, exact values, restrictions, or provenance.
   */
  static minimize(context: VerifiedAIEvidenceContextEnvelope): MinimizationResult {
    const originalStr = JSON.stringify(context);
    const originalSizeBytes = Buffer.byteLength(originalStr, 'utf8');
    const removedFields: string[] = [];

    // Clone context
    const minimized: VerifiedAIEvidenceContextEnvelope = JSON.parse(originalStr);

    // 1. Remove optional non-essential educational content if present
    if (minimized.explanationContext?.approvedContent?.educational) {
      delete minimized.explanationContext.approvedContent.educational;
      removedFields.push('explanationContext.approvedContent.educational');
    }

    // 2. Remove redundant internal UI labels from decision payload
    if (minimized.decisionContext?.authoritativePayload?.uiRenderingHints) {
      delete minimized.decisionContext.authoritativePayload.uiRenderingHints;
      removedFields.push('decisionContext.authoritativePayload.uiRenderingHints');
    }

    // 3. Remove non-essential publisher metadata if not required by licence
    if (
      minimized.evidenceContext?.sourceMetadata &&
      !minimized.evidenceContext.sourceMetadata.licenceOrUsagePolicyId
    ) {
      if (minimized.evidenceContext.sourceMetadata.publisher) {
        delete minimized.evidenceContext.sourceMetadata.publisher;
        removedFields.push('evidenceContext.sourceMetadata.publisher');
      }
    }

    const minimizedStr = JSON.stringify(minimized);
    const minimizedSizeBytes = Buffer.byteLength(minimizedStr, 'utf8');

    return {
      originalSizeBytes,
      minimizedSizeBytes,
      removedFields,
      minimizedContext: minimized,
    };
  }
}
