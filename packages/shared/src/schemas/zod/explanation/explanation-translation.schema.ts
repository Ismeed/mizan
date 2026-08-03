/**
 * Zod Schema for Explanation Translation
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { z } from 'zod';

export const ExplanationTranslationSchema = z.object({
  explanationId: z.string().min(1),
  explanationVersion: z.string().min(1),
  languageTag: z.string().min(2),
  locale: z.string().min(2),
  direction: z.enum(['LTR', 'RTL']),

  content: z.object({
    title: z.string().min(1),
    short: z.string().min(1),
    full: z.string().min(1),
    educational: z.string().nullable().default(null),
    accessibilityText: z.string().optional(),
  }),

  terminologyVersion: z.string().default('1.0.0'),

  translationMetadata: z.object({
    translationType: z.enum([
      'ORIGINAL_EXPLANATION',
      'APPROVED_TRANSLATION',
      'APPROVED_ADAPTATION',
      'EVIDENCE_TRANSLATION',
      'EVIDENCE_COMMENTARY',
    ]),
    translatedBy: z.array(z.string()).default([]),
    reviewedBy: z.array(z.string()).default([]),
    reviewedAt: z.string().nullable().default(null),
    sourceLanguageTag: z.string().default('en'),
    translationStatus: z.enum(['DRAFT', 'REVIEWED', 'APPROVED', 'PRODUCTION']).default('DRAFT'),
    governanceStage: z
      .enum(['LINGUISTIC_REVIEW', 'SHARIA_TERMINOLOGY_REVIEW', 'TECHNICAL_VALIDATION', 'APPROVED'])
      .optional(),
    isTestFixture: z.boolean().optional(),
  }),

  integrity: z.object({
    translationChecksum: z.string().min(1),
  }),
});
