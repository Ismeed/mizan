/**
 * MIZAN — Result Evidence Assembler Service (Phase 13)
 * Assembles ResultEvidenceLink records for result items.
 */

import type { ResultEvidenceLink, EvidenceSupportType } from '@mizan/shared';
import crypto from 'crypto';

export interface CreateEvidenceLinkInput {
  evidenceId: string;
  evidenceVersion?: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
  supports: EvidenceSupportType;
  relatedRuleId?: string;
}

export class ResultEvidenceAssemblerService {
  static createEvidenceLink(input: CreateEvidenceLinkInput): ResultEvidenceLink {
    return {
      resultEvidenceLinkId: `link_${crypto.randomUUID()}`,
      evidenceId: input.evidenceId,
      evidenceVersion: input.evidenceVersion ?? '1.0.0',
      evidenceType: input.evidenceType,
      supports: input.supports,
      relatedRuleId: input.relatedRuleId ?? null,
      relatedRuleVersion: '1.0.0',
      madhhabScopeValidated: true,
      display: {
        showInResult: true,
        showInPdf: true,
        showInAIContext: true,
        displayPriority: 1,
      },
    };
  }
}
