/**
 * MIZAN — Zod Schemas for Agriculture Zakat Rule Engine (Phase 10)
 */

import { z } from 'zod';

export const AgricultureProduceTypeIdSchema = z.enum([
  'WHEAT',
  'BARLEY',
  'DATES',
  'RAISINS',
  'RICE',
  'CORN',
  'MILLET',
  'LENTILS',
  'CHICKPEAS',
  'OLIVES',
  'OTHER_GRAIN',
  'OTHER_FRUIT',
  'OTHER_PRODUCE',
  'REVIEW_REQUIRED',
]);

export const AgricultureIrrigationMethodSchema = z.enum([
  'RAIN_FED',
  'IRRIGATED_WITH_COST',
  'IRRIGATED_WITHOUT_COST',
  'SPRING_FED',
  'FLOOD_FED',
  'MIXED',
  'UNKNOWN',
]);

export const ExactFractionSchema = z.object({
  numerator: z.bigint().or(z.number().transform(n => BigInt(n))),
  denominator: z.bigint().or(z.number().transform(n => BigInt(n))),
});

export const AgricultureHarvestFactsSchema = z.object({
  harvestDate: z.string(),
  produceTypeId: AgricultureProduceTypeIdSchema,
  quantity: ExactFractionSchema,
  quantityUnit: z.enum(['WASQ', 'KG', 'TONNE', 'LOCAL_UNIT']),
  qualityGrade: z.enum(['SUPERIOR', 'MEDIUM', 'INFERIOR', 'MIXED']).optional(),
});

export const AgricultureIrrigationFactsSchema = z.object({
  method: AgricultureIrrigationMethodSchema,
  mixedRecord: z
    .object({
      rainFedFraction: ExactFractionSchema,
      irrigatedFraction: ExactFractionSchema,
      mixedRuleId: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  irrigationCostBorne: z.boolean(),
  irrigationCostEvidenceId: z.string().optional(),
});

export const CanonicalAgricultureFactsSchema = z.object({
  assetInstanceId: z.string(),
  categoryId: z.literal('AGRICULTURAL_PRODUCE'),
  produceTypeId: AgricultureProduceTypeIdSchema,
  harvest: AgricultureHarvestFactsSchema,
  irrigation: AgricultureIrrigationFactsSchema,
  ownership: z.object({
    ownershipStartDate: z.string(),
    isFullOwner: z.boolean(),
    ownershipShare: ExactFractionSchema.optional(),
  }),
  season: z
    .object({
      seasonId: z.string().optional(),
      seasonLabel: z.string().optional(),
      hijriYear: z.number().optional(),
    })
    .optional(),
});

export const AgricultureNisabIdSchema = z.string().regex(/^ZAKAT-AGRI-NISAB-[A-Z_-]+-\d{3}$/);
export const AgricultureRateIdSchema = z.string().regex(/^ZAKAT-AGRI-RATE-[A-Z_-]+-\d{3}$/);
