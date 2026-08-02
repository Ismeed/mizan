/**
 * MIZAN — Zod Schemas for Canonical Heir Registry (Phase 7)
 *
 * Validates permanent heir identifiers, entity records, groups, and aliases.
 */

import { z } from 'zod';

/**
 * Regex for Canonical Heir IDs:
 * Must be uppercase ASCII English, underscore-separated, no spaces, no lowercase.
 * Must NOT contain madhhab names, language tags, or share fractions.
 */
export const CANONICAL_HEIR_ID_REGEX = /^[A_Z][A_Z_]*[A_Z]$/;

export const CanonicalHeirIdSchema = z.string().superRefine((val, ctx) => {
  if (!/^[A-Z_]+$/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Canonical Heir ID "${val}" must be uppercase ASCII with underscores only.`,
    });
  }

  // Reject madhhab names in ID
  const forbiddenPatterns = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI', '_V1', '_V2', 'ARABIC', 'HAUSA'];
  for (const forbidden of forbiddenPatterns) {
    if (val.includes(forbidden)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Canonical Heir ID "${val}" must not contain forbidden metadata/language string "${forbidden}".`,
      });
    }
  }
});

export const RelationshipCategorySchema = z.enum([
  'SPOUSE',
  'ASCENDANT',
  'DESCENDANT',
  'SIBLING',
  'SIBLING_DESCENDANT',
  'PATERNAL_UNCLE',
  'PATERNAL_UNCLE_DESCENDANT',
  'COLLATERAL',
  'OTHER_APPROVED_RELATIONSHIP',
]);

export const LineageSideSchema = z.enum(['NONE', 'PATERNAL', 'MATERNAL', 'BOTH']);

export const SexClassificationSchema = z.enum(['MALE', 'FEMALE']);

export const GenerationDirectionSchema = z.enum(['SAME_GENERATION', 'ASCENDING', 'DESCENDING']);

export const HeirInputSupportStatusSchema = z.enum([
  'SUPPORTED',
  'NOT_SUPPORTED',
  'NOT_YET_MODELLED',
  'REVIEW_REQUIRED',
]);

export const HeirGovernanceStatusSchema = z.enum([
  'DRAFT',
  'ACADEMIC_REVIEW',
  'SHARIA_REVIEW',
  'TECHNICAL_VALIDATION',
  'APPROVED',
  'INDEXED',
  'PRODUCTION',
]);

export const HeirClassificationSchema = z.object({
  relationshipCategory: RelationshipCategorySchema,
  lineageSide: LineageSideSchema,
  sexClassification: SexClassificationSchema,
  generationDirection: GenerationDirectionSchema,
  generationDistance: z.number().int().min(0),
});

export const HeirRelationshipSchema = z.object({
  canonicalName: z.string().min(1),
  lineagePath: z.array(z.union([z.string(), z.record(z.string())])),
  parentHeirId: z.string().nullable().optional(),
  relatedHeirIds: z.array(z.string()).optional(),
});

export const HeirLocalizationKeysSchema = z.object({
  labelKey: z.string().min(1),
  descriptionKey: z.string().min(1),
  singularLabelKey: z.string().min(1),
  pluralLabelKey: z.string().min(1),
});

export const HeirMadhhabSupportDetailSchema = z.object({
  inputSupportStatus: HeirInputSupportStatusSchema,
  notes: z.string().optional(),
});

export const HeirMadhhabMetadataSchema = z.object({
  HANAFI: HeirMadhhabSupportDetailSchema,
  MALIKI: HeirMadhhabSupportDetailSchema,
  SHAFII: HeirMadhhabSupportDetailSchema,
  HANBALI: HeirMadhhabSupportDetailSchema,
  JAFARI: HeirMadhhabSupportDetailSchema,
});

export const HeirInputMetadataSchema = z.object({
  allowCount: z.boolean(),
  minimumCount: z.number().int().min(0),
  maximumCount: z.number().int().min(1).nullable(),
  allowIndividualNames: z.boolean(),
});

export const HeirGovernanceSchema = z.object({
  status: HeirGovernanceStatusSchema,
  effectiveFrom: z.string().nullable().optional(),
  effectiveUntil: z.string().nullable().optional(),
  reviewMetadata: z
    .object({
      academicReviewedBy: z.string().optional(),
      shariaReviewedBy: z.string().optional(),
      technicalReviewedBy: z.string().optional(),
      reviewNotes: z.string().optional(),
    })
    .optional(),
});

export const HeirIntegritySchema = z.object({
  contentChecksum: z.string().min(1),
  createdAt: z.string().min(1),
  createdBy: z.string().min(1),
  updatedAt: z.string().min(1),
  updatedBy: z.string().min(1),
});

export const HeirEntityRecordSchema = z.object({
  heirId: CanonicalHeirIdSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  classification: HeirClassificationSchema,
  relationship: HeirRelationshipSchema,
  localization: HeirLocalizationKeysSchema,
  madhhabMetadata: HeirMadhhabMetadataSchema,
  groupMemberships: z.array(z.string()),
  inputMetadata: HeirInputMetadataSchema,
  governance: HeirGovernanceSchema,
  integrity: HeirIntegritySchema,
});
