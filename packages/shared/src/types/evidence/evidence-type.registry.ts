/**
 * Supported Canonical Evidence Types in MIZAN (Phase 4)
 */

export enum EvidenceType {
  QURAN = 'QURAN',
  HADITH = 'HADITH',
  FIQH_REFERENCE = 'FIQH_REFERENCE',
  SCHOLARLY_REFERENCE = 'SCHOLARLY_REFERENCE',
  LEGAL_MAXIM = 'LEGAL_MAXIM',
  INSTITUTIONAL_SHARIA_DECISION = 'INSTITUTIONAL_SHARIA_DECISION',
  APPROVED_EXPLANATORY_NOTE = 'APPROVED_EXPLANATORY_NOTE',
}

export interface EvidenceTypeDefinition {
  type: EvidenceType;
  displayName: string;
  description: string;
  isPrimarySource: boolean;
  requiresReview: boolean;
  requiresAttribution: boolean;
}

export const EVIDENCE_TYPE_REGISTRY: Record<EvidenceType, EvidenceTypeDefinition> = {
  [EvidenceType.QURAN]: {
    type: EvidenceType.QURAN,
    displayName: "Qur'an Verse / Range",
    description: "Authoritative Qur'anic text and approved translations",
    isPrimarySource: true,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.HADITH]: {
    type: EvidenceType.HADITH,
    displayName: 'Hadith Narration',
    description: 'Prophetic tradition with canonical numbering and attributed scholar grading',
    isPrimarySource: true,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.FIQH_REFERENCE]: {
    type: EvidenceType.FIQH_REFERENCE,
    displayName: 'Classical Fiqh Reference',
    description: 'Recognised classical jurisprudential work within a specific madhhab',
    isPrimarySource: false,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.SCHOLARLY_REFERENCE]: {
    type: EvidenceType.SCHOLARLY_REFERENCE,
    displayName: 'Contemporary Scholarly Reference',
    description: 'Peer-reviewed, institutional, or contemporary academic financial fiqh material',
    isPrimarySource: false,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.LEGAL_MAXIM]: {
    type: EvidenceType.LEGAL_MAXIM,
    displayName: 'Legal Maxim (Al-Qawaid al-Fiqhiyyah)',
    description: 'Recognised general jurisprudential principle governing Islamic commercial law',
    isPrimarySource: false,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.INSTITUTIONAL_SHARIA_DECISION]: {
    type: EvidenceType.INSTITUTIONAL_SHARIA_DECISION,
    displayName: 'Institutional Sharia Decision',
    description: 'Formal ruling or standard issued by an approved Sharia board or council (e.g. AAOIFI, OIC Fiqh Academy)',
    isPrimarySource: false,
    requiresReview: true,
    requiresAttribution: true,
  },
  [EvidenceType.APPROVED_EXPLANATORY_NOTE]: {
    type: EvidenceType.APPROVED_EXPLANATORY_NOTE,
    displayName: 'Approved Explanatory Note',
    description: 'Editorial or educational explanation reviewed and approved by MIZAN Sharia board',
    isPrimarySource: false,
    requiresReview: true,
    requiresAttribution: false,
  },
};

export function isSupportedEvidenceType(type: string): type is EvidenceType {
  return Object.values(EvidenceType).includes(type as EvidenceType);
}
