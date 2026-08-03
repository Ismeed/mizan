/**
 * MIZAN — Result Evidence Link Contract (Phase 13)
 * Links specific evidence records to individual result items.
 */

export type EvidenceSupportType =
  | 'ELIGIBILITY'
  | 'DECISION'
  | 'FRACTION'
  | 'RATE'
  | 'BLOCKING'
  | 'EXCEPTION'
  | 'NISAB'
  | 'OBLIGATION'
  | 'EXPLANATION';

export interface ResultEvidenceDisplayMetadata {
  showInResult: boolean;
  showInPdf: boolean;
  showInAIContext: boolean;
  displayPriority: number;
}

export interface ResultEvidenceLink {
  resultEvidenceLinkId: string;
  evidenceId: string;
  evidenceVersion: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
  supports: EvidenceSupportType;
  relatedRuleId?: string | null;
  relatedRuleVersion?: string | null;
  madhhabScopeValidated: boolean;
  display: ResultEvidenceDisplayMetadata;
}
