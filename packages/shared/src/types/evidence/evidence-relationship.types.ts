/**
 * Evidence Relationships & Inter-linking Standard (Phase 4)
 */

export type EvidenceRelationshipType =
  | 'SUPPORTS_RULE'
  | 'EXPLAINS_RULE'
  | 'PRIMARY_EVIDENCE_FOR'
  | 'SECONDARY_EVIDENCE_FOR'
  | 'RELATED_TO'
  | 'SAME_NARRATION_AS'
  | 'COMMENTARY_ON'
  | 'TRANSLATION_OF'
  | 'SUPERSEDES_VERSION'
  | 'CLARIFIES'
  | 'CONTEXTUALISES'
  | 'DIFFERS_FROM'
  | 'MUST_BE_READ_WITH';

export interface EvidenceRelationship {
  relationshipId: string;
  sourceEvidenceId: string;
  sourceEvidenceVersion: string;
  relationshipType: EvidenceRelationshipType;
  targetType: 'RULE' | 'EVIDENCE' | 'EXPLANATION';
  targetId: string;
  targetVersion: string;
  madhhabScope: string[];
  reviewStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  notes?: string;
}
