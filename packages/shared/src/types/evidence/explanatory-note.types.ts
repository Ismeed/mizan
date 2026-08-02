/**
 * Approved Explanatory Note Schema Contract (Phase 4)
 */

import { BaseEvidence } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';

export interface ExplanatoryAuthorship {
  authorType: 'MIZAN_EDITORIAL' | 'SHARIA_BOARD' | 'ACADEMIC_CONSULTANT';
  authors: string[];
  reviewedBy: string[];
}

export interface ApprovedExplanatoryNote extends BaseEvidence {
  evidenceType: EvidenceType.APPROVED_EXPLANATORY_NOTE;
  titles: {
    en: string;
    ha: string;
    ar: string;
  };
  content: {
    en: string;
    ha: string;
    ar: string;
  };
  supportsEvidenceIds: string[];
  supportsRuleIds: string[];
  authorship: ExplanatoryAuthorship;
}
