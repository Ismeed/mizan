/**
 * MIZAN — Report Explanation Presentation Contract (Phase 14)
 */

export interface FormattedReportExplanation {
  explanationId: string;
  explanationVersion: string;
  explanationKind: 'APPROVED_EXPLANATION' | 'AI_GENERATED_CLARIFICATION';
  relatedResultItemId: string;
  selectedMadhhab: string;
  shortSummary: string;
  fullExplanationText: string;
  evidenceIds: string[];
  translationFallbackApplied: boolean;
  fallbackLanguageTag?: string | null;
}
