/**
 * MIZAN — Canonical Heir Identifier & Entity Types (Phase 7)
 *
 * Defines the core type system for the Canonical Heir Registry.
 *
 * CRITICAL CONSTRAINTS:
 * - Every heir identifier must be uppercase ASCII English technical terminology
 * - Identifiers must NOT include madhhab names, language tags, share fractions, or rulings
 * - Entity records describe identity and presentation ONLY (no fixed shares or blocking rulings)
 * - Identifiers must be language-neutral and independent of DB primary keys
 */

import type { MadhhabCode } from '../profile.types';

// ─── Permanent Canonical Heir Identifier Union ─────────────────────────────────

export type CanonicalHeirId =
  // Spouses
  | 'HUSBAND'
  | 'WIFE'
  // Immediate Ascendants
  | 'FATHER'
  | 'MOTHER'
  // Grandparents & Higher Ascendants
  | 'PATERNAL_GRANDFATHER'
  | 'MATERNAL_GRANDFATHER'
  | 'PATERNAL_GRANDMOTHER'
  | 'MATERNAL_GRANDMOTHER'
  | 'PATERNAL_GREAT_GRANDFATHER'
  | 'MATERNAL_GREAT_GRANDFATHER'
  | 'PATERNAL_GREAT_GRANDMOTHER'
  | 'MATERNAL_GREAT_GRANDMOTHER'
  // Immediate Descendants
  | 'SON'
  | 'DAUGHTER'
  // Descendants Through a Son
  | 'SONS_SON'
  | 'SONS_DAUGHTER'
  | 'SONS_SONS_SON'
  | 'SONS_SONS_DAUGHTER'
  // Descendants Through a Daughter
  | 'DAUGHTERS_SON'
  | 'DAUGHTERS_DAUGHTER'
  // Full Siblings
  | 'FULL_BROTHER'
  | 'FULL_SISTER'
  // Paternal Siblings
  | 'PATERNAL_BROTHER'
  | 'PATERNAL_SISTER'
  // Maternal Siblings
  | 'MATERNAL_BROTHER'
  | 'MATERNAL_SISTER'
  | 'MATERNAL_HALF_SIBLING'
  // Descendants of Full Brothers
  | 'FULL_BROTHERS_SON'
  | 'FULL_BROTHERS_SONS_SON'
  // Descendants of Paternal Brothers
  | 'PATERNAL_BROTHERS_SON'
  | 'PATERNAL_BROTHERS_SONS_SON'
  // Father's Full Brothers & Descendants
  | 'FATHERS_FULL_BROTHER'
  | 'FATHERS_FULL_BROTHERS_SON'
  | 'FATHERS_FULL_BROTHERS_SONS_SON'
  // Father's Paternal Brothers & Descendants
  | 'FATHERS_PATERNAL_BROTHER'
  | 'FATHERS_PATERNAL_BROTHERS_SON'
  | 'FATHERS_PATERNAL_BROTHERS_SONS_SON';

// ─── Classification Enums ──────────────────────────────────────────────────────

export type RelationshipCategory =
  | 'SPOUSE'
  | 'ASCENDANT'
  | 'DESCENDANT'
  | 'SIBLING'
  | 'SIBLING_DESCENDANT'
  | 'PATERNAL_UNCLE'
  | 'PATERNAL_UNCLE_DESCENDANT'
  | 'COLLATERAL'
  | 'OTHER_APPROVED_RELATIONSHIP';

export type LineageSide = 'NONE' | 'PATERNAL' | 'MATERNAL' | 'BOTH';

export type SexClassification = 'MALE' | 'FEMALE';

export type GenerationDirection = 'SAME_GENERATION' | 'ASCENDING' | 'DESCENDING';

export type HeirInputSupportStatus =
  | 'SUPPORTED'
  | 'NOT_SUPPORTED'
  | 'NOT_YET_MODELLED'
  | 'REVIEW_REQUIRED';

export type HeirGovernanceStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED'
  | 'INDEXED'
  | 'PRODUCTION';

// ─── Classification Interface ─────────────────────────────────────────────────

export interface HeirClassification {
  relationshipCategory: RelationshipCategory;
  lineageSide: LineageSide;
  sexClassification: SexClassification;
  generationDirection: GenerationDirection;
  /** Distance in generations from deceased (0 = same generation, 1 = parent/child, 2 = grandparent/grandchild) */
  generationDistance: number;
}

// ─── Relationship Metadata ────────────────────────────────────────────────────

export interface HeirRelationship {
  /** English canonical name (e.g., "Full Brother") */
  canonicalName: string;
  /** Machine-readable lineage path from deceased */
  lineagePath: (string | Record<string, string>)[];
  /** Parent heir ID in hierarchy, if any */
  parentHeirId?: CanonicalHeirId | null;
  /** Closely related heir IDs */
  relatedHeirIds?: CanonicalHeirId[];
}

// ─── Localization Keys ────────────────────────────────────────────────────────

export interface HeirLocalizationKeys {
  labelKey: string;
  descriptionKey: string;
  singularLabelKey: string;
  pluralLabelKey: string;
}

// ─── Madhhab Input Support Metadata ───────────────────────────────────────────

export interface HeirMadhhabSupportDetail {
  inputSupportStatus: HeirInputSupportStatus;
  notes?: string;
}

export type HeirMadhhabMetadata = Record<MadhhabCode, HeirMadhhabSupportDetail>;

// ─── Input Metadata ───────────────────────────────────────────────────────────

export interface HeirInputMetadata {
  allowCount: boolean;
  minimumCount: number;
  maximumCount: number | null;
  allowIndividualNames: boolean;
}

// ─── Governance & Integrity ───────────────────────────────────────────────────

export interface HeirGovernance {
  status: HeirGovernanceStatus;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  reviewMetadata?: {
    academicReviewedBy?: string;
    shariaReviewedBy?: string;
    technicalReviewedBy?: string;
    reviewNotes?: string;
  };
}

export interface HeirIntegrity {
  contentChecksum: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// ─── Canonical Heir Entity Record ──────────────────────────────────────────────

export interface HeirEntityRecord {
  /** Permanent ASCII uppercase ID */
  heirId: CanonicalHeirId;
  /** Entity version, e.g., "1.0.0" */
  version: string;
  /** Schema version, e.g., "1.0.0" */
  schemaVersion: string;

  classification: HeirClassification;
  relationship: HeirRelationship;
  localization: HeirLocalizationKeys;
  madhhabMetadata: HeirMadhhabMetadata;
  groupMemberships: string[];
  inputMetadata: HeirInputMetadata;
  governance: HeirGovernance;
  integrity: HeirIntegrity;
}
