/**
 * MIZAN — Explanation Reference Contract (Phase 13)
 * The calculation engine returns explanation references, not translated prose strings.
 */

export type ExplanationPurpose =
  | 'SHORT_RESULT'
  | 'FULL_RESULT'
  | 'EDUCATIONAL'
  | 'WARNING'
  | 'REVIEW_REQUIRED';

export interface ResultExplanationLink {
  explanationId: string;
  explanationVersion: string;
  purpose: ExplanationPurpose;
  relatedRuleId?: string | null;
  relatedEvidenceIds: string[];
  madhhabScopeValidated: boolean;
}
