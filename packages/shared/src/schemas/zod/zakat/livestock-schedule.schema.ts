/**
 * MIZAN — Livestock Schedule Zod Validation Schemas (Phase 9)
 *
 * Enforces runtime validation on permanent livestock schedule identifiers,
 * bands, obligation definitions, and full canonical schedule records.
 */

import { z } from 'zod';

export const LIVESTOCK_SCHEDULE_ID_REGEX =
  /^ZAKAT-LIVESTOCK-([A-Z0-9_]+)-([A-Z0-9_]+)-([0-9]{3})$/;

export const livestockScheduleIdSchema = z
  .string()
  .regex(
    LIVESTOCK_SCHEDULE_ID_REGEX,
    'Schedule ID must follow the standard: ZAKAT-LIVESTOCK-<ANIMAL_TYPE>-<CONTEXT>-<NNN>'
  );

export const livestockScheduleRangeSchema = z.object({
  minimumCount: z.number().int().min(0),
  maximumCount: z.number().int().min(0).nullable(),
  minimumInclusive: z.boolean(),
  maximumInclusive: z.boolean(),
  isOpenEnded: z.boolean().optional(),
});

export const livestockScheduleBandSchema = z.object({
  bandId: z.string().min(1),
  sequence: z.number().int().min(1),
  range: livestockScheduleRangeSchema,
  conditions: z.record(z.unknown()).optional(),
  obligation: z.object({
    obligationDefinitionId: z.string().min(1),
  }),
  evidenceLinks: z.array(
    z.object({
      evidenceId: z.string(),
      evidenceVersion: z.string(),
      supports: z.enum(['COUNT_RANGE', 'OBLIGATION', 'ANIMAL_CLASS', 'EXCEPTION']),
    })
  ),
  explanationIds: z.array(z.string()),
  governance: z.object({
    status: z.enum(['DRAFT', 'APPROVED', 'PRODUCTION']),
    isTestFixture: z.boolean().optional(),
    fixtureTag: z.literal('TEST_ONLY_FIXTURE').optional(),
  }),
});

export const canonicalLivestockScheduleSchema = z.object({
  scheduleId: livestockScheduleIdSchema,
  version: z.string().min(1),
  schemaVersion: z.string().min(1),
  identity: z.object({
    module: z.literal('ZAKAT'),
    ruleType: z.literal('ZAKAT_LIVESTOCK_SCHEDULE'),
    categoryId: z.string(),
    animalTypeId: z.string(),
    ruleFamilyId: z.string(),
    topic: z.literal('LIVESTOCK_ZAKAT'),
    subtopic: z.string(),
  }),
  titles: z.object({
    en: z.string().min(1),
    ha: z.string().optional(),
    ar: z.string().optional(),
  }),
  madhhabScope: z.object({
    mode: z.enum(['SHARED', 'SELECTIVE', 'SINGLE_MADHHAB']),
    appliesTo: z.array(z.string()),
    excludedMadhhabs: z.array(z.string()),
  }),
  eligibilityRuleIds: z.array(z.string()),
  scheduleModel: z.object({
    modelType: z.enum(['EXPLICIT_BANDS', 'REPEATING_PATTERN', 'COMBINATORIAL_PATTERN', 'HYBRID', 'REVIEW_REQUIRED']),
    bands: z.array(livestockScheduleBandSchema),
    patterns: z.array(z.unknown()),
    combinationRules: z.array(z.unknown()),
    remainderRules: z.array(z.unknown()),
  }),
  obligationDefinitions: z.array(z.string()),
  exceptions: z.array(z.string()),
  execution: z.object({
    stage: z.literal('LIVESTOCK_SCHEDULE_RESOLUTION'),
    priority: z.number().int(),
    terminal: z.boolean(),
  }),
  references: z.object({
    evidenceIds: z.array(z.string()),
    fiqhReferenceIds: z.array(z.string()),
    explanationIds: z.array(z.string()),
    sourceRecordIds: z.array(z.string()),
  }),
  governance: z.object({
    status: z.enum(['DRAFT', 'ACADEMIC_REVIEW', 'SHARIA_REVIEW', 'TECHNICAL_VALIDATION', 'APPROVED', 'PRODUCTION']),
    isTestFixture: z.boolean().optional(),
    fixtureTag: z.literal('TEST_ONLY_FIXTURE').optional(),
    effectiveFrom: z.string().optional(),
    effectiveUntil: z.string().optional(),
  }),
  integrity: z.object({
    contentChecksum: z.string().min(1),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
  }),
});
