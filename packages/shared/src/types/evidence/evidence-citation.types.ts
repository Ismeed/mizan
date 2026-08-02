/**
 * Evidence Citation Display Contract (Phase 4)
 */

import { EvidenceType } from './evidence-type.registry';

export interface EvidenceCitationDisplay {
  evidenceId: string;
  evidenceVersion: string;
  evidenceType: EvidenceType;
  reference: {
    short: string;
    full: string;
    academic?: string;
    pdf?: string;
  };
  content: {
    originalText: string;
    approvedTranslation: string;
    translationLanguage: string;
    approvedExplanation?: string;
    attributionText?: string;
  };
  madhhab: {
    selected: string;
    scopeValidated: boolean;
  };
  actions: {
    canOpenAIExplanation: boolean;
    canViewSourceDetails: boolean;
    canCopyReference: boolean;
  };
}
