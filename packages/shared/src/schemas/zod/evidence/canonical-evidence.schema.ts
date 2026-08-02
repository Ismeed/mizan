import { z } from 'zod';
import { EVIDENCE_ID_REGEX } from '../../../types/evidence/evidence-identifier.types';
import { EvidenceType } from '../../../types/evidence/evidence-type.registry';

export const EvidenceIdSchema = z.string().regex(EVIDENCE_ID_REGEX, {
  message: 'Invalid evidence ID format. Must match permanent ID pattern e.g. QURAN-004-011-011 or HADITH-BUKHARI-001454',
});

export const LicenceStatusSchema = z.enum([
  'PUBLIC_DOMAIN',
  'LICENSED',
  'PERMISSION_GRANTED',
  'ATTRIBUTION_REQUIRED',
  'INTERNAL_USE_ONLY',
  'RESTRICTED',
  'UNKNOWN',
]);

export const GovernanceStatusSchema = z.enum([
  'DRAFT',
  'ACADEMIC_REVIEW',
  'SHARIA_REVIEW',
  'TECHNICAL_VALIDATION',
  'APPROVED',
  'INDEXED',
  'PRODUCTION',
  'CHANGES_REQUESTED',
  'REJECTED',
  'DEPRECATED',
  'ARCHIVED',
]);

export const BaseEvidenceSchema = z.object({
  evidenceId: EvidenceIdSchema,
  version: z.string().min(1),
  schemaVersion: z.string().default('1.0.0'),
  evidenceType: z.nativeEnum(EvidenceType),

  identity: z.object({
    moduleScope: z.array(z.enum(['MIRATH', 'ZAKAT', 'SHARED'])).min(1),
    topics: z.array(z.string()),
    subtopics: z.array(z.string()),
    canonicalReference: z.string().min(1),
    shortReference: z.string().min(1),
  }),

  madhhabScope: z.object({
    mode: z.enum(['SHARED', 'SINGLE_MADHHAB', 'SELECTIVE', 'COMPARATIVE']),
    appliesTo: z.array(z.enum(['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'])),
    excludedMadhhabs: z.array(z.enum(['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'])).optional(),
  }),

  content: z.record(z.any()),
  translations: z.record(z.any()),

  citation: z.object({
    short: z.string().min(1),
    full: z.string().min(1),
    academic: z.string().optional(),
    pdf: z.string().optional(),
  }),

  sourceProvenance: z.object({
    sourceType: z.string().min(1),
    sourceId: z.string().min(1),
    title: z.string().min(1),
    author: z.string().optional(),
    editor: z.string().optional(),
    translator: z.string().optional(),
    institution: z.string().optional(),
    publisher: z.string().optional(),
    publicationYear: z.string().optional(),
    volume: z.string().optional(),
    chapter: z.string().optional(),
    section: z.string().optional(),
    pageStart: z.number().nullable().optional(),
    pageEnd: z.number().nullable().optional(),
    paragraph: z.string().optional(),
    lineStart: z.number().nullable().optional(),
    lineEnd: z.number().nullable().optional(),
    originalLanguage: z.string().min(1),
    sourceFileId: z.string().optional(),
    sourceFileChecksum: z.string().optional(),
    extractionMethod: z.enum(['MANUAL', 'OCR', 'VERIFIED_IMPORT', 'API_SYNC']),
    verifiedAgainstSource: z.boolean(),
    verifiedBy: z.array(z.string()),
    verifiedAt: z.string().nullable().optional(),
  }),

  relationships: z.object({
    ruleIds: z.array(z.string()),
    explanationIds: z.array(z.string()),
    relatedEvidenceIds: z.array(z.string()),
    supersedesEvidenceVersion: z.string().nullable().optional(),
  }),

  licensing: z.object({
    licenceStatus: LicenceStatusSchema,
    licenceName: z.string().optional(),
    licenceUrl: z.string().optional(),
    rightsHolder: z.string().optional(),
    permissionReference: z.string().optional(),
    attributionRequired: z.boolean(),
    attributionText: z.string().optional(),
    commercialUseAllowed: z.boolean(),
    modificationAllowed: z.boolean(),
    redistributionAllowed: z.boolean(),
    expiryDate: z.string().nullable().optional(),
  }),

  governance: z.object({
    status: GovernanceStatusSchema,
    reviewMetadata: z.object({
      submittedBy: z.string().optional(),
      submittedAt: z.string().optional(),
      academicReviewedBy: z.array(z.string()).optional(),
      academicReviewedAt: z.string().optional(),
      shariaReviewedBy: z.array(z.string()).optional(),
      shariaReviewedAt: z.string().optional(),
      technicalValidatedBy: z.string().optional(),
      technicalValidatedAt: z.string().optional(),
      approvedBy: z.array(z.string()).optional(),
      approvedAt: z.string().optional(),
      rejectionReason: z.string().optional(),
    }),
    effectiveFrom: z.string().nullable().optional(),
    effectiveUntil: z.string().nullable().optional(),
  }),

  integrity: z.object({
    contentChecksum: z.string().min(1),
    sourceChecksum: z.string().min(1),
    createdAt: z.string().min(1),
    createdBy: z.string().min(1),
    updatedAt: z.string().min(1),
    updatedBy: z.string().min(1),
  }),

  isTestFixture: z.boolean().optional(),
  fixtureTag: z.string().optional(),
});

export const QuranEvidenceSchema = BaseEvidenceSchema.extend({
  evidenceType: z.literal(EvidenceType.QURAN),
  reference: z.object({
    surahNumber: z.number().int().min(1).max(114),
    surahNameArabic: z.string().min(1),
    surahNames: z.object({
      en: z.string().min(1),
      ha: z.string().min(1),
      ar: z.string().min(1),
    }),
    ayahStart: z.number().int().min(1),
    ayahEnd: z.number().int().min(1),
    canonicalReference: z.string().min(1),
    shortReference: z.string().min(1),
  }).refine((data) => data.ayahEnd >= data.ayahStart, {
    message: 'ayahEnd cannot be less than ayahStart',
  }),
  content: z.object({
    arabicText: z.string().min(1),
    uthmaniText: z.string().min(1),
    plainArabicText: z.string().min(1),
    searchNormalisedText: z.string().optional(),
    verseSequenceVerified: z.boolean(),
  }),
});

export const HadithEvidenceSchema = BaseEvidenceSchema.extend({
  evidenceType: z.literal(EvidenceType.HADITH),
  reference: z.object({
    collectionId: z.string().min(1),
    collectionNames: z.object({
      en: z.string().min(1),
      ha: z.string().min(1),
      ar: z.string().min(1),
    }),
    canonicalHadithNumber: z.string().min(1),
    editionSpecificNumbers: z.array(z.object({
      sourceEditionId: z.string().min(1),
      editionName: z.string().min(1),
      number: z.string().min(1),
      volume: z.string().optional(),
      book: z.string().optional(),
      chapter: z.string().optional(),
      page: z.string().optional(),
    })),
    canonicalReference: z.string().min(1),
    shortReference: z.string().min(1),
  }),
  content: z.object({
    arabicText: z.string().min(1),
    chainOfNarration: z.string().optional(),
    matnText: z.string().min(1),
    narrator: z.string().optional(),
  }),
  grading: z.object({
    primaryGrade: z.object({
      grade: z.enum(['SAHIH', 'HASAN', 'DAIF', 'MAWDU', 'MUTAWATIR', 'AHAD', 'SCHOLAR_DISAGREEMENT']),
      grader: z.string().min(1),
      gradingSourceId: z.string().min(1),
      reviewStatus: z.enum(['DRAFT', 'APPROVED', 'REJECTED']),
    }),
    additionalGradingRecords: z.array(z.any()).default([]),
    displayPolicy: z.enum(['SHOW_APPROVED_PRIMARY', 'SHOW_APPROVED_PRIMARY_WITH_ADDITIONAL_RECORDS', 'SHOW_ALL_ATTRIBUTED_GRADES']),
  }),
});
