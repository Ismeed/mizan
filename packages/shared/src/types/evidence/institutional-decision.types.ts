/**
 * Institutional Sharia Board Decision Schema Contract (Phase 4)
 */

import { BaseEvidence, EvidenceMadhhabScope } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';
import { MultilingualContent } from './multilingual-content.types';

export interface InstitutionInfo {
  institutionId: string;
  officialName: string;
  countryCode?: string;
  website?: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED';
}

export interface DecisionInfo {
  decisionNumber: string;
  title: string;
  dateIssued?: string;
  scope?: string;
  originalLanguage: string;
  originalText: string;
}

export interface InstitutionalDecisionEvidence extends BaseEvidence {
  evidenceType: EvidenceType.INSTITUTIONAL_SHARIA_DECISION;
  institution: InstitutionInfo;
  decision: DecisionInfo;
  signatories: string[];
  madhhabScope: EvidenceMadhhabScope;
  sourceDocument: {
    sourceFileId?: string;
    checksum?: string;
    licenceStatus?: string;
    verificationMethod?: string;
  };
  translations: Record<string, MultilingualContent>;
}
