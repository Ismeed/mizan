/**
 * MIZAN — Result Relationships Contract (Phase 13)
 * Tracks structural relationships between result versions.
 */

export type ResultRelationshipType =
  | 'RECALCULATION_OF'
  | 'CORRECTION_OF'
  | 'REVALUATION_OF'
  | 'TRANSLATED_RENDERING_OF'
  | 'ALTERNATIVE_CURRENCY_RENDERING_OF'
  | 'SUPERSEDES_DRAFT_RESULT';

export interface ResultRelationship {
  relationshipId: string;
  relationshipType: ResultRelationshipType;
  sourceResultId: string;
  targetResultId: string;
  reason?: string | null;
  createdAt: string;
}
