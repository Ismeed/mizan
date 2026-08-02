/**
 * MIZAN — Hijab Rule Zod Schema (Phase 6)
 *
 * Validates HijabRuleRecord instances at import time and in API handlers.
 * All schema properties mirror hijab-rule.types.ts exactly.
 */

import { z } from 'zod';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const HijabEffectTypeSchema = z.enum(['HIRMAN', 'NUQSAN']);
export const HijabCategoryTypeSchema = z.enum(['HAJB_BIL_WASF', 'HAJB_BIL_SHAKHSY']);

export const HijabEvidenceRefSchema = z.object({
  evidenceId:       z.string().min(1),
  evidenceVersion:  z.string().min(1),
  referenceLabel:   z.string().min(1),
  evidenceType:     z.enum(['QURAN', 'HADITH', 'FIQH_BOOK', 'CONSENSUS', 'SCHOLARLY_OPINION']),
  evidenceStrength: z.enum(['DEFINITIVE', 'STRONG', 'ACCEPTABLE', 'WEAK']),
  isMandatory:      z.boolean(),
});

export const HijabExplanationRefSchema = z.object({
  explanationId:      z.string().min(1),
  explanationVersion: z.string().min(1),
  audienceType:       z.enum(['GENERAL_USER', 'SCHOLAR', 'TECHNICAL']),
  languageCode:       z.string().min(2).max(10),
});

export const HijabRuleGovernanceSchema = z.object({
  status: z.enum([
    'DRAFT',
    'ACADEMIC_REVIEW',
    'SHARIA_REVIEW',
    'TECHNICAL_VALIDATION',
    'APPROVED',
    'PRODUCTION',
    'DEPRECATED',
    'REJECTED',
    'SUPERSEDED',
  ]),
  isTestFixture:     z.boolean(),
  fixtureTag:        z.literal('TEST_ONLY_FIXTURE').optional(),
  schemaVersion:     z.string().min(1),
  createdBy:         z.string().min(1),
  createdAt:         z.string().datetime({ offset: true }),
  updatedBy:         z.string().min(1),
  updatedAt:         z.string().datetime({ offset: true }),
  reviewNotes:       z.string().optional(),
  requiresScholarCounterSignPerExecution: z.boolean().optional(),
}).refine(
  (g) => !g.isTestFixture || g.fixtureTag === 'TEST_ONLY_FIXTURE',
  { message: 'Test fixtures must have fixtureTag set to TEST_ONLY_FIXTURE' }
).refine(
  (g) => g.status !== 'PRODUCTION' || !g.isTestFixture,
  { message: 'A test fixture may not be marked PRODUCTION' }
);

export const HijabRuleVersioningSchema = z.object({
  contentChecksum: z.string().min(64).max(64),
  supersedes:      z.string().optional(),
  effectiveFrom:   z.string().datetime({ offset: true }).optional(),
  effectiveUntil:  z.string().datetime({ offset: true }).optional(),
  changelogNote:   z.string().optional(),
});

const RuleMadhhabScopeSchema = z.enum([
  'HANAFI',
  'MALIKI',
  'SHAFII',
  'HANBALI',
  'JAFARI',
  'ALL_SUNNI',
  'ALL_SCHOOLS',
]);

const FracSchema = z.object({
  numerator:   z.number().int().positive(),
  denominator: z.number().int().positive(),
});

// ─── Root schema ──────────────────────────────────────────────────────────────

const HIJAB_RULE_ID_REGEX = /^HIJAB-[A-Z0-9_]+-[A-Z0-9_]+-\d{3}$/;

export const HijabRuleRecordSchema = z.object({
  hijabRuleId:      z.string().regex(HIJAB_RULE_ID_REGEX, {
    message: 'hijabRuleId must match format HIJAB-<BLOCKED_HEIR>-<BLOCKING_CAUSE>-NNN',
  }),
  hijabRuleVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  titleEn:          z.string().min(5),
  titleAr:          z.string().optional(),
  descriptionEn:    z.string().min(10),
  category:         HijabCategoryTypeSchema,
  blockedHeirKey:   z.string().min(1),
  blockingCause:    z.string().min(1),
  effectType:       HijabEffectTypeSchema,
  reducedFraction:  FracSchema.optional(),
  madhhabScope:     z.array(RuleMadhhabScopeSchema).min(1),
  evidenceRefs:     z.array(HijabEvidenceRefSchema).min(1),
  explanationRefs:  z.array(HijabExplanationRefSchema),
  governance:       HijabRuleGovernanceSchema,
  versioning:       HijabRuleVersioningSchema,
})
  .refine(
    (r) => r.effectType !== 'NUQSAN' || r.reducedFraction !== undefined,
    { message: 'NUQSAN rules must specify reducedFraction' }
  )
  .refine(
    (r) => r.effectType !== 'HIRMAN' || r.reducedFraction === undefined,
    { message: 'HIRMAN rules must not include reducedFraction' }
  )
  .refine(
    (r) => r.evidenceRefs.length > 0,
    { message: 'At least one evidence reference is required for every hijab rule' }
  );

export type HijabRuleRecordInput = z.input<typeof HijabRuleRecordSchema>;
export type HijabRuleRecordOutput = z.output<typeof HijabRuleRecordSchema>;
