/**
 * MIZAN — Zod Runtime Validation Schema for CanonicalRule
 *
 * Used to validate rule JSON on import, export, and registry load.
 * Must be kept in sync with canonical-rule.types.ts.
 */

import { z } from 'zod';
import { RULE_ID_REGEX } from '../../types/rule-identifier.types';
import { ALL_RULE_TYPES } from '../../types/rule-types.registry';

// ─── Frac Schema ─────────────────────────────────────────────────────────────
export const FracSchema = z.object({
  n: z.number().int('Numerator must be an integer'),
  d: z.number().int('Denominator must be an integer').positive('Denominator must be positive'),
}).strict();

// ─── Condition Schemas ───────────────────────────────────────────────────────

const ConditionOperatorSchema = z.enum([
  'EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL',
  'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'IN', 'NOT_IN',
  'EXISTS', 'NOT_EXISTS', 'IS_TRUE', 'IS_FALSE',
  'CONTAINS', 'DOES_NOT_CONTAIN', 'BETWEEN_INCLUSIVE', 'MATCHES_ENUM',
]);

const ConditionLeafSchema = z.object({
  type: z.literal('LEAF'),
  factsPath: z.string().min(1),
  operator: ConditionOperatorSchema,
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number()])),
  ]).optional(),
  description: z.string().optional(),
}).strict();

const ConditionGroupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.literal('GROUP'),
    operator: z.enum(['ALL', 'ANY', 'NOT']),
    conditions: z.array(z.union([ConditionLeafSchema, ConditionGroupSchema])).min(1),
    description: z.string().optional(),
  }).strict()
);

const ConditionSchema = z.union([ConditionLeafSchema, ConditionGroupSchema]);

// ─── Decision Schemas ─────────────────────────────────────────────────────────

const AssignFixedFractionSchema = z.object({
  decisionType: z.literal('ASSIGN_FIXED_FRACTION'),
  targetEntity: z.string().min(1),
  fraction: FracSchema,
  distributionMethod: z.enum(['EQUAL_SHARE', 'SINGLE_SHARE', 'MALE_DOUBLE_FEMALE']),
  conditionSummary: z.string().optional(),
}).strict();

const AssignResiduaryStatusSchema = z.object({
  decisionType: z.literal('ASSIGN_RESIDUARY_STATUS'),
  targetEntity: z.string().min(1),
  residuaryClass: z.enum(['ASABAH_BIN_NAFS', 'ASABAH_BIL_GHAIR', 'ASABAH_MAL_GHAIR']),
}).strict();

const BlockHeirSchema = z.object({
  decisionType: z.literal('BLOCK_HEIR'),
  targetEntity: z.string().min(1),
  blockingEntity: z.string().min(1),
  reasonCode: z.string().min(1),
  blockingType: z.enum(['COMPLETE', 'PARTIAL']),
}).strict();

const ReduceShareSchema = z.object({
  decisionType: z.literal('REDUCE_SHARE'),
  targetEntity: z.string().min(1),
  reductionMethod: z.enum(['AWL_PROPORTIONAL', 'PRESENCE_OF_CHILDREN', 'CUSTOM']),
  reducedFraction: FracSchema.optional(),
}).strict();

const ChangeEligibilitySchema = z.object({
  decisionType: z.literal('CHANGE_ELIGIBILITY'),
  targetEntity: z.string().min(1),
  eligibilityStatus: z.enum(['ELIGIBLE', 'INELIGIBLE', 'CONDITIONAL']),
  reasonCode: z.string().min(1),
}).strict();

const SetZakatRateSchema = z.object({
  decisionType: z.literal('SET_ZAKAT_RATE'),
  rateBasisPoints: z.number().int().positive(),
  rateAsRational: FracSchema,
  rateLabel: z.string().min(1),
}).strict();

const SetNisabMethodSchema = z.object({
  decisionType: z.literal('SET_NISAB_METHOD'),
  nisabMethod: z.enum(['GOLD', 'SILVER', 'LOWER', 'HIGHER']),
  goldGrams: z.number().positive().optional(),
  silverGrams: z.number().positive().optional(),
}).strict();

const ApplyLivestockScheduleSchema = z.object({
  decisionType: z.literal('APPLY_LIVESTOCK_SCHEDULE'),
  scheduleId: z.string().min(1),
  scheduleVersion: z.string().min(1),
  livestockType: z.enum(['CAMEL', 'CATTLE', 'SHEEP_GOAT']),
}).strict();

const SetHoldingPeriodSchema = z.object({
  decisionType: z.literal('SET_HOLDING_PERIOD'),
  lunarMonths: z.number().int().positive(),
  description: z.string().optional(),
}).strict();

const AggregateAssetCategoriesSchema = z.object({
  decisionType: z.literal('AGGREGATE_ASSET_CATEGORIES'),
  categories: z.array(z.string().min(1)).min(1),
  aggregationMethod: z.enum(['SUM', 'NET_AFTER_LIABILITIES']),
}).strict();

const ExcludeAssetCategorySchema = z.object({
  decisionType: z.literal('EXCLUDE_ASSET_CATEGORY'),
  category: z.string().min(1),
  reasonCode: z.string().min(1),
  description: z.string().optional(),
}).strict();

const RequireScholarReviewSchema = z.object({
  decisionType: z.literal('REQUIRE_SCHOLAR_REVIEW'),
  reasonCode: z.string().min(1),
  affectedTopic: z.string().min(1),
  publicExplanationId: z.string().optional(),
  severity: z.enum(['INFORMATIONAL', 'WARNING', 'MANDATORY_STOP']),
}).strict();

const AddWarningSchema = z.object({
  decisionType: z.literal('ADD_WARNING'),
  warningCode: z.string().min(1),
  publicExplanationId: z.string().optional(),
  userMessage: z.string().min(1),
}).strict();

const StopCalculationBranchSchema = z.object({
  decisionType: z.literal('STOP_CALCULATION_BRANCH'),
  reasonCode: z.string().min(1),
  requiresManualReview: z.boolean(),
  publicExplanationId: z.string().optional(),
}).strict();

const RuleDecisionSchema = z.discriminatedUnion('decisionType', [
  AssignFixedFractionSchema,
  AssignResiduaryStatusSchema,
  BlockHeirSchema,
  ReduceShareSchema,
  ChangeEligibilitySchema,
  SetZakatRateSchema,
  SetNisabMethodSchema,
  ApplyLivestockScheduleSchema,
  SetHoldingPeriodSchema,
  AggregateAssetCategoriesSchema,
  ExcludeAssetCategorySchema,
  RequireScholarReviewSchema,
  AddWarningSchema,
  StopCalculationBranchSchema,
]);

// ─── Evidence & Explanation Schemas ──────────────────────────────────────────

const RuleEvidenceRefSchema = z.object({
  evidenceId: z.string().min(1),
  evidenceVersion: z.string().min(1),
  referenceLabel: z.string().min(1),
  evidenceType: z.enum(['QURAN', 'HADITH', 'FIQH_BOOK', 'CONSENSUS', 'SCHOLARLY_OPINION']),
  evidenceStrength: z.enum(['DEFINITIVE', 'STRONG', 'ACCEPTABLE', 'WEAK']),
  isMandatory: z.boolean(),
}).strict();

const RuleExplanationRefSchema = z.object({
  explanationId: z.string().min(1),
  explanationVersion: z.string().min(1),
  audienceType: z.enum(['GENERAL_USER', 'SCHOLAR', 'TECHNICAL']),
  languageCode: z.string().min(2).max(5),
}).strict();

// ─── Full Canonical Rule Schema ───────────────────────────────────────────────

const MadhhabScopeSchema = z.enum([
  'HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI', 'ALL_SUNNI', 'ALL_SCHOOLS',
]);

export const CanonicalRuleSchema = z.object({
  identity: z.object({
    ruleId: z.string().regex(RULE_ID_REGEX, 'Invalid MIZAN rule ID format'),
    ruleVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver'),
    ruleFamilyId: z.string().optional(),
    overridesRuleId: z.string().regex(RULE_ID_REGEX).optional(),
    requiresPreviousRules: z.array(z.string().regex(RULE_ID_REGEX)).optional(),
    incompatibleWithRules: z.array(z.string().regex(RULE_ID_REGEX)).optional(),
  }).strict(),

  titles: z.object({
    titleEn: z.string().min(5).max(200),
    titleAr: z.string().max(200).optional(),
    titleFr: z.string().max(200).optional(),
    descriptionEn: z.string().min(10).max(2000),
    descriptionAr: z.string().max(2000).optional(),
  }).strict(),

  scope: z.object({
    module: z.enum(['MIRATH', 'ZAKAT', 'SHARED']),
    ruleType: z.enum(ALL_RULE_TYPES as [string, ...string[]]),
    madhhabScope: z.array(MadhhabScopeSchema).min(1),
    knowledgeReleaseVersion: z.string().min(1),
    priority: z.number().int().min(0).max(1000).optional(),
  }).strict(),

  applicability: z.object({
    conditions: ConditionSchema,
    conditionSummary: z.string().optional(),
    conditionCount: z.number().int().min(0).optional(),
  }).strict(),

  decisions: z.array(RuleDecisionSchema).min(1),

  evidenceRefs: z.array(RuleEvidenceRefSchema),
  explanationRefs: z.array(RuleExplanationRefSchema),

  governance: z.object({
    status: z.enum([
      'DRAFT', 'ACADEMIC_REVIEW', 'SHARIA_REVIEW', 'TECHNICAL_VALIDATION',
      'APPROVED', 'PRODUCTION', 'DEPRECATED', 'REJECTED', 'SUPERSEDED',
    ]),
    isTestFixture: z.boolean(),
    fixtureTag: z.literal('TEST_ONLY_FIXTURE').optional(),
    schemaVersion: z.string().min(1),
    createdBy: z.string().min(1),
    createdAt: z.string().datetime({ offset: true }),
    updatedBy: z.string().min(1),
    updatedAt: z.string().datetime({ offset: true }),
    reviewNotes: z.string().optional(),
    requiresScholarCounterSignPerExecution: z.boolean().optional(),
  }).strict().superRefine((gov, ctx) => {
    // A test fixture cannot be PRODUCTION
    if (gov.isTestFixture && gov.status === 'PRODUCTION') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A test fixture rule (isTestFixture: true) cannot have PRODUCTION status.',
        path: ['status'],
      });
    }
    // Non-test fixture must NOT have fixtureTag
    if (!gov.isTestFixture && gov.fixtureTag === 'TEST_ONLY_FIXTURE') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Only test fixtures should have fixtureTag = TEST_ONLY_FIXTURE.',
        path: ['fixtureTag'],
      });
    }
  }),

  versioning: z.object({
    contentChecksum: z.string().length(64, 'Must be a 64-char SHA-256 hex string'),
    supersedes: z.string().optional(),
    effectiveFrom: z.string().datetime({ offset: true }).optional(),
    effectiveUntil: z.string().datetime({ offset: true }).optional(),
    changelogNote: z.string().optional(),
  }).strict(),
}).strict();

export type CanonicalRuleInput = z.input<typeof CanonicalRuleSchema>;
export type CanonicalRuleOutput = z.output<typeof CanonicalRuleSchema>;
