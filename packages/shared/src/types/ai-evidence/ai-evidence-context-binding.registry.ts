/**
 * AI Evidence Context Binding Registry (Phase 16)
 */

export const AI_EVIDENCE_CONTEXT_BINDINGS = {
  CALCULATION_BOUND: 'CALCULATION_BOUND',
  REPORT_BOUND: 'REPORT_BOUND',
  STANDALONE_EVIDENCE: 'STANDALONE_EVIDENCE',
  COMPARATIVE_CONTEXT: 'COMPARATIVE_CONTEXT',
  SCHOLAR_REVIEW_CONTEXT: 'SCHOLAR_REVIEW_CONTEXT',
} as const;

export type AIEvidenceContextBinding = typeof AI_EVIDENCE_CONTEXT_BINDINGS[keyof typeof AI_EVIDENCE_CONTEXT_BINDINGS];

export const ALL_AI_EVIDENCE_CONTEXT_BINDINGS: AIEvidenceContextBinding[] = Object.values(AI_EVIDENCE_CONTEXT_BINDINGS);

export function isValidAIEvidenceContextBinding(binding: string): binding is AIEvidenceContextBinding {
  return ALL_AI_EVIDENCE_CONTEXT_BINDINGS.includes(binding as AIEvidenceContextBinding);
}
