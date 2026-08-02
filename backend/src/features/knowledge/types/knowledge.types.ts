/**
 * MIZAN Knowledge Repository & Governance Lifecycle — Core Types
 */

export type RecordType = 'SOURCE' | 'RULE' | 'EVIDENCE' | 'EXPLANATION' | 'ENTITY';
export type KnowledgeModule = 'MIRATH' | 'ZAKAT' | 'SHARED';
export type MadhhabScope = 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI';
export type LanguageScope = 'en' | 'ha' | 'ar' | 'fr' | 'sw';

export type KnowledgeStatus =
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

export type GovernanceRole =
  | 'RESEARCH_ASSISTANT'
  | 'DATA_EDITOR'
  | 'ACADEMIC_REVIEWER'
  | 'SHARIA_REVIEWER'
  | 'TECHNICAL_REVIEWER'
  | 'KNOWLEDGE_ADMIN'
  | 'INDEXING_SERVICE'
  | 'PUBLICATION_ADMIN'
  | 'AUDITOR';

export type SourceType = 'QURAN' | 'HADITH' | 'FIQH_BOOK' | 'MIZAN_AUTHORED';
export type ExtractionMethod = 'MANUAL' | 'OCR' | 'IMPORT';
export type LicenceStatus = 'PUBLIC_DOMAIN' | 'PERMITTED' | 'RESTRICTED';

export interface SourceProvenance {
  sourceType: SourceType;
  bookTitle: string;
  author: string;
  editor?: string;
  publisher?: string;
  edition?: string;
  publicationYear?: string;
  volume?: string;
  chapter?: string;
  section?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  paragraph?: string;
  originalLanguage?: string;
  sourceFileId?: string;
  sourceFileChecksum?: string;
  licenceStatus?: LicenceStatus;
  permissionReference?: string;
  extractionMethod: ExtractionMethod;
  verifiedAgainstPhysicalCopy: boolean;

  // Quran specific
  surahNumber?: number;
  surahName?: string;
  ayahStart?: number;
  ayahEnd?: number;

  // Hadith specific
  collection?: string;
  bookNumber?: number;
  hadithNumber?: string;
  grading?: string;
}

export interface BaseKnowledgeRecordPayload {
  knowledgeId: string;
  recordType: RecordType;
  module: KnowledgeModule;
  topic: string;
  subtopic: string;
  madhhabScope: MadhhabScope[];
  languageScope: LanguageScope[];
  status: KnowledgeStatus;
  version: string;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  supersedes?: string | null;
  supersededBy?: string | null;
  sourceProvenance: SourceProvenance;
  evidenceIds: string[];
  relatedRuleIds: string[];
  relatedExplanationIds: string[];
  reviewMetadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  contentChecksum: string;
  schemaVersion: string;
  contentData: Record<string, any>;
}

export interface TransitionRule {
  from: KnowledgeStatus;
  to: KnowledgeStatus;
  requiredRole: GovernanceRole[];
  requireComment?: boolean;
}

export interface GateValidationResult {
  passed: boolean;
  knowledgeId: string;
  version: string;
  checks: {
    statusCheck: boolean;
    checksumCheck: boolean;
    provenanceCheck: boolean;
    evidenceLinksCheck: boolean;
    schemaCheck: boolean;
    madhhabScopeCheck: boolean;
    languageScopeCheck: boolean;
    noPendingChangesCheck: boolean;
  };
  errors: string[];
}

export interface KnowledgeManifestPayload {
  manifestName: string;
  module: KnowledgeModule | 'RELEASE';
  version: string;
  generatedDate: string;
  generatedBy: string;
  schemaVersion: string;
  releaseVersion: string;
  validationStatus: 'VALID' | 'INVALID';
  recordCount: number;
  records: Array<{
    knowledgeId: string;
    version: string;
    contentChecksum: string;
    status: KnowledgeStatus;
  }>;
  manifestChecksum: string;
}
