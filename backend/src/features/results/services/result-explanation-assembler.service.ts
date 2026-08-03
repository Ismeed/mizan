/**
 * MIZAN — Result Explanation Assembler Service (Phase 13)
 * Assembles ResultExplanationLink references for result items.
 */

import type { ResultExplanationLink, ExplanationPurpose } from '@mizan/shared';

export interface CreateExplanationLinkInput {
  explanationId: string;
  explanationVersion?: string;
  purpose: ExplanationPurpose;
  relatedRuleId?: string;
  relatedEvidenceIds?: string[];
}

export class ResultExplanationAssemblerService {
  static createExplanationLink(input: CreateExplanationLinkInput): ResultExplanationLink {
    return {
      explanationId: input.explanationId,
      explanationVersion: input.explanationVersion ?? '1.0.0',
      purpose: input.purpose,
      relatedRuleId: input.relatedRuleId ?? null,
      relatedEvidenceIds: input.relatedEvidenceIds ?? [],
      madhhabScopeValidated: true,
    };
  }
}
