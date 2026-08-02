/**
 * MIZAN — Zod Schemas for Canonical Zakat Category Registry (Phase 8)
 *
 * Validates permanent category identifiers, entity records, groups, and aliases.
 *
 * CRITICAL CONSTRAINTS:
 * - CanonicalZakatCategoryIdSchema rejects madhhab names, translated terms, etc.
 * - ZakatCategoryEntityRecordSchema validates all entity fields.
 * - All schemas are strict (no extra fields allowed).
 */

import { z } from 'zod';

// ─── Canonical Category ID Schema ─────────────────────────────────────────────

/**
 * Validates a Canonical Zakat Category ID:
 * - Must be UPPERCASE_SNAKE_CASE
 * - Must consist only of A-Z, 0-9, and underscores
 * - Must NOT contain madhhab names (HANAFI, MALIKI, etc.)
 * - Must NOT be empty
 */
export const CanonicalZakatCategoryIdSchema = z.string()
  .min(2, 'Category ID must be at least 2 characters')
  .max(80, 'Category ID must not exceed 80 characters')
  .regex(
    /^[A-Z][A-Z0-9_]*[A-Z0-9]$|^[A-Z]$/,
    'Category ID must be UPPERCASE_SNAKE_CASE (A-Z, 0-9, underscores only)'
  )
  .refine(
    (id) => !['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'].some(m => id.includes(m)),
    'Category ID must not contain madhhab names'
  )
  .refine(
    (id) => !id.startsWith('_') && !id.endsWith('_'),
    'Category ID must not start or end with an underscore'
  )
  .refine(
    (id) => !id.includes('__'),
    'Category ID must not contain double underscores'
  );

// ─── Classification Schemas ────────────────────────────────────────────────────

export const ZakatCategoryDomainSchema = z.enum([
  'MONETARY', 'PRECIOUS_METALS', 'TRADE', 'INVESTMENTS',
  'RECEIVABLES', 'AGRICULTURE', 'LIVESTOCK', 'INCOME', 'LIABILITIES',
]);

export const ZakatValueTypeSchema = z.enum([
  'CURRENCY_AMOUNT', 'WEIGHT_GRAMS', 'UNITS', 'PERCENTAGE', 'DERIVED',
]);

export const ZakatNisabBaseSchema = z.enum([
  'GOLD_85_GRAMS', 'SILVER_595_GRAMS', 'PRODUCE_WEIGHT',
  'CAMEL_COUNT', 'CATTLE_COUNT', 'SHEEP_GOAT_COUNT',
  'MADHHAB_SPECIFIC', 'NOT_APPLICABLE',
]);

export const ZakatHawlRequirementSchema = z.enum([
  'REQUIRED', 'NOT_REQUIRED', 'MADHHAB_SPECIFIC', 'NOT_APPLICABLE',
]);

export const ZakatCategoryGovernanceStatusSchema = z.enum([
  'DRAFT', 'ACADEMIC_REVIEW', 'SHARIA_REVIEW', 'TECHNICAL_VALIDATION',
  'APPROVED', 'INDEXED', 'PRODUCTION', 'DEPRECATED',
]);

export const ZakatCategoryInputSupportStatusSchema = z.enum([
  'SUPPORTED', 'NOT_SUPPORTED', 'NOT_YET_MODELLED', 'REVIEW_REQUIRED',
]);

// ─── Madhhab Metadata Schema ───────────────────────────────────────────────────

export const ZakatCategoryMadhhabEntrySchema = z.object({
  inputSupportStatus: ZakatCategoryInputSupportStatusSchema,
  zakatableOverride: z.boolean().optional(),
  nisabBaseOverride: ZakatNisabBaseSchema.optional(),
  scholarNotes: z.string().max(2000).optional(),
});

export const ZakatCategoryMadhhabMetadataSchema = z.object({
  HANAFI:  ZakatCategoryMadhhabEntrySchema,
  MALIKI:  ZakatCategoryMadhhabEntrySchema,
  SHAFII:  ZakatCategoryMadhhabEntrySchema,
  HANBALI: ZakatCategoryMadhhabEntrySchema,
  JAFARI:  ZakatCategoryMadhhabEntrySchema,
});

// ─── Classification Schema ─────────────────────────────────────────────────────

export const ZakatCategoryClassificationSchema = z.object({
  domain: ZakatCategoryDomainSchema,
  valueType: ZakatValueTypeSchema,
  nisabBase: ZakatNisabBaseSchema,
  hawlRequirement: ZakatHawlRequirementSchema,
  isLiability: z.boolean(),
  requiresAggregation: z.boolean().optional(),
});

// ─── Localization Keys Schema ──────────────────────────────────────────────────

export const ZakatCategoryLocalizationKeysSchema = z.object({
  labelKey: z.string().min(1),
  descriptionKey: z.string().min(1),
  reportLabelKey: z.string().min(1),
  placeholderKey: z.string().optional(),
});

// ─── Input Metadata Schema ────────────────────────────────────────────────────

export const ZakatCategoryInputMetadataSchema = z.object({
  valueType: ZakatValueTypeSchema,
  minimumValue: z.number().min(0),
  maximumValue: z.number().nullable(),
  unit: z.string().optional(),
  allowsItemBreakdown: z.boolean(),
  isUserInput: z.boolean(),
  requiresIrrigationMethod: z.boolean().optional(),
});

// ─── Governance Schema ────────────────────────────────────────────────────────

export const ZakatCategoryGovernanceSchema = z.object({
  status: ZakatCategoryGovernanceStatusSchema,
  effectiveFrom: z.string().datetime(),
  effectiveUntil: z.string().datetime().optional(),
});

// ─── Integrity Schema ─────────────────────────────────────────────────────────

export const ZakatCategoryIntegritySchema = z.object({
  contentChecksum: z.string().length(64).regex(/^[a-f0-9]+$/, 'Must be a SHA-256 hex string'),
  createdAt: z.string().datetime(),
  createdBy: z.string().min(1),
  updatedAt: z.string().datetime(),
  updatedBy: z.string().min(1),
});

// ─── Full Entity Record Schema ─────────────────────────────────────────────────

export const ZakatCategoryEntityRecordSchema = z.object({
  categoryId: CanonicalZakatCategoryIdSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string'),
  schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semver string'),
  canonicalName: z.string().min(1).max(200),
  classification: ZakatCategoryClassificationSchema,
  localization: ZakatCategoryLocalizationKeysSchema,
  madhhabMetadata: ZakatCategoryMadhhabMetadataSchema,
  groupMemberships: z.array(z.string().min(1)),
  inputMetadata: ZakatCategoryInputMetadataSchema,
  governance: ZakatCategoryGovernanceSchema,
  integrity: ZakatCategoryIntegritySchema,
});

// ─── Group Record Schema ───────────────────────────────────────────────────────

export const ZakatGroupMemberEntrySchema = z.object({
  categoryId: CanonicalZakatCategoryIdSchema,
  displayOrder: z.number().int().min(0),
  madhhabScope: z.array(z.string()).optional(),
  isMandatory: z.boolean(),
});

export const ZakatCategoryGroupRecordSchema = z.object({
  groupId: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  canonicalName: z.string().min(1).max(200),
  labelKey: z.string().min(1),
  descriptionKey: z.string().min(1),
  membershipMode: z.enum(['STATIC', 'MADHHAB_SPECIFIC']),
  members: z.array(ZakatGroupMemberEntrySchema),
  displayOrder: z.number().int().min(0),
  isCollapsible: z.boolean(),
  status: z.enum(['DRAFT', 'APPROVED', 'PRODUCTION', 'DEPRECATED']),
});

// ─── Alias Record Schema ───────────────────────────────────────────────────────

export const ZakatCategoryAliasRecordSchema = z.object({
  aliasText: z.string().min(1).max(200),
  targetCategoryId: CanonicalZakatCategoryIdSchema,
  aliasType: z.enum([
    'COMMON_TERM', 'SCHOLARLY_TERM', 'LEGACY_TERM',
    'TRANSLITERATION', 'SPELLING_VARIANT', 'LEGACY_CAMELCASE_KEY',
  ]),
  matchingMode: z.enum(['EXACT', 'NORMALIZED_EXACT']),
  languageCode: z.string().optional(),
  isDeprecated: z.boolean(),
  migrationNote: z.string().max(500).optional(),
});

// ─── Type Inference ────────────────────────────────────────────────────────────

export type ValidatedZakatCategoryEntityRecord = z.infer<typeof ZakatCategoryEntityRecordSchema>;
export type ValidatedZakatCategoryGroupRecord   = z.infer<typeof ZakatCategoryGroupRecordSchema>;
export type ValidatedZakatCategoryAliasRecord   = z.infer<typeof ZakatCategoryAliasRecordSchema>;
