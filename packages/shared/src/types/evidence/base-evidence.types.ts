/**
 * Base Evidence Contract (Phase 4)
 * Every specialized evidence type extends this base interface.
 */

import { EvidenceType } from './evidence-type.registry';
import { EvidenceSourceProvenance } from './evidence-provenance.types';
import { EvidenceLicensing } from './evidence-licensing.types';

export type GovernanceStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED'
  | 'INDEXED'
  | 'PRODUCTION'
  | 'CHANGES_REQUESTED'
  | 'REJECTED'
  | 'DEPRECATED'
  | 'ARCHIVED';

export type MadhhabMode = 'SHARED' | 'SINGLE_MADHHAB' | 'SELECTIVE' | 'COMPARATIVE';

export interface EvidenceMadhhabScope {
  mode: MadhhabMode;
  appliesTo: Array<'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI'>;
  excludedMadhhabs?: Array<'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI'>;
}

export interface BaseEvidenceIdentity {
  moduleScope: Array<'MIRATH' | 'ZAKAT' | 'SHARED'>;
  topics: string[];
  subtopics: string[];
  canonicalReference: string;
  shortReference: string;
}

export interface BaseEvidenceRelationships {
  ruleIds: string[];
  explanationIds: string[];
  relatedEvidenceIds: string[];
  supersedesEvidenceVersion?: string | null;
}

export interface EvidenceGovernance {
  status: GovernanceStatus;
  reviewMetadata: {
    submittedBy?: string;
    submittedAt?: string;
    academicReviewedBy?: string[];
    academicReviewedAt?: string;
    shariaReviewedBy?: string[];
    shariaReviewedAt?: string;
    technicalValidatedBy?: string;
    technicalValidatedAt?: string;
    approvedBy?: string[];
    approvedAt?: string;
    rejectionReason?: string;
  };
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
}

export interface EvidenceIntegrity {
  contentChecksum: string;
  sourceChecksum: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface BaseEvidence {
  evidenceId: string;
  version: string;
  schemaVersion: string;
  evidenceType: EvidenceType;
  identity: BaseEvidenceIdentity;
  madhhabScope: EvidenceMadhhabScope;
  content: Record<string, any>;
  translations: Record<string, any>;
  citation: {
    short: string;
    full: string;
    academic?: string;
    pdf?: string;
  };
  sourceProvenance: EvidenceSourceProvenance;
  relationships: BaseEvidenceRelationships;
  licensing: EvidenceLicensing;
  governance: EvidenceGovernance;
  integrity: EvidenceIntegrity;
  isTestFixture?: boolean;
  fixtureTag?: string;
}
