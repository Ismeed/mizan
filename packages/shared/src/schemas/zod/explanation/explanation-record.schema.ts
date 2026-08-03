/**
 * Zod Schema for Explanation Record
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { z } from 'zod';

export const ExplanationIdRegex = /^[A-Z][A-Z0-9]*(-[A-Z][A-Z0-9]*)*-[0-9]{3}$/;

export const ExplanationRecordSchema = z.object({
  explanationId: z.string().regex(ExplanationIdRegex, {
    message: 'explanationId must be uppercase, hyphen-separated, ASCII, ending in 3 digits (e.g. MIRATH-EXPLANATION-SPOUSE-SHARE-001)',
  }),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, { message: 'version must be semantic versioning x.y.z' }),
  schemaVersion: z.string().default('1.0.0'),

  identity: z.object({
    module: z.enum(['MIRATH', 'ZAKAT', 'SHARED']),
    explanationType: z.enum([
      'CALCULATION_DECISION',
      'ELIGIBILITY',
      'FIXED_SHARE',
      'RESIDUARY_STATUS',
      'HIJAB_COMPLETE_EXCLUSION',
      'HIJAB_PARTIAL_EFFECT',
      'NISAB_RESULT',
      'HOLDING_PERIOD_RESULT',
      'ZAKAT_RATE',
      'LIVESTOCK_SCHEDULE_RESULT',
      'AGRICULTURE_IRRIGATION_RESULT',
      'AGRICULTURE_AGGREGATION_RESULT',
      'DEDUCTION_RESULT',
      'EVIDENCE_EXPLANATION',
      'WARNING',
      'REVIEW_REQUIRED',
      'UNSUPPORTED_CASE',
      'EDUCATIONAL_NOTE',
    ]),
    topic: z.string().min(1),
    subtopic: z.string().optional(),
  }),

  relationships: z.object({
    ruleIds: z.array(z.string()).default([]),
    ruleFamilyIds: z.array(z.string()).default([]),
    evidenceIds: z.array(z.string()).default([]),
    heirIds: z.array(z.string()).default([]),
    zakatCategoryIds: z.array(z.string()).default([]),
    livestockScheduleIds: z.array(z.string()).default([]),
    agricultureRuleIds: z.array(z.string()).default([]),
  }),

  madhhabScope: z.object({
    mode: z.enum(['SHARED', 'SELECTIVE', 'SINGLE_MADHHAB']),
    appliesTo: z.array(z.string()).default([]),
    excludedMadhhabs: z.array(z.string()).default([]),
  }),

  content: z.object({
    defaultLanguageTag: z.string().default('en'),
    translations: z.record(z.string()).default({}),
  }),

  variables: z.array(z.string()).default([]),

  display: z.object({
    shortVersionAvailable: z.boolean().default(true),
    fullVersionAvailable: z.boolean().default(true),
    educationalVersionAvailable: z.boolean().default(false),
    showEvidenceLinks: z.boolean().default(true),
    showMadhhabLabel: z.boolean().default(true),
  }),

  references: z.object({
    evidenceIds: z.array(z.string()).default([]),
    fiqhReferenceIds: z.array(z.string()).default([]),
    sourceRecordIds: z.array(z.string()).default([]),
  }),

  governance: z.object({
    status: z.enum(['DRAFT', 'REVIEWED', 'APPROVED', 'PRODUCTION']).default('DRAFT'),
    reviewMetadata: z.record(z.any()).default({}),
    effectiveFrom: z.string().nullable().default(null),
    effectiveUntil: z.string().nullable().default(null),
    reviewedBy: z.array(z.string()).optional(),
    approvedBy: z.array(z.string()).optional(),
  }),

  integrity: z.object({
    contentChecksum: z.string().min(1),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
    isTestFixture: z.boolean().optional(),
  }),
});
