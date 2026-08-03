/**
 * MIZAN — Canonical Livestock Schedule Contracts (Phase 9)
 *
 * Structured, versioned schedules mapping animal counts to obligations.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';
import type { CanonicalZakatCategoryId } from '../canonical-zakat-category.types';

export type LivestockScheduleModelType =
  | 'EXPLICIT_BANDS'
  | 'REPEATING_PATTERN'
  | 'COMBINATORIAL_PATTERN'
  | 'HYBRID'
  | 'REVIEW_REQUIRED';

export type ScheduleMadhhabMode = 'SHARED' | 'SELECTIVE' | 'SINGLE_MADHHAB';

export interface LivestockScheduleMadhhabScope {
  mode: ScheduleMadhhabMode;
  appliesTo: string[];
  excludedMadhhabs: string[];
}

export interface LivestockScheduleRange {
  minimumCount: number;
  maximumCount: number | null;
  minimumInclusive: boolean;
  maximumInclusive: boolean;
  isOpenEnded?: boolean;
}

export interface ScheduleBandEvidenceLink {
  evidenceId: string;
  evidenceVersion: string;
  supports: 'COUNT_RANGE' | 'OBLIGATION' | 'ANIMAL_CLASS' | 'EXCEPTION';
}

export interface LivestockScheduleBand {
  bandId: string;
  sequence: number;
  range: LivestockScheduleRange;
  conditions?: {
    all?: unknown[];
    any?: unknown[];
    not?: unknown[];
  };
  obligation: {
    obligationDefinitionId: string;
  };
  evidenceLinks: ScheduleBandEvidenceLink[];
  explanationIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
}

export interface LivestockPatternUnit {
  unitId: string;
  herdCountUnit: number;
  obligationDefinitionId: string;
}

export interface LivestockRepeatingPattern {
  patternId: string;
  version: string;
  activation: {
    minimumCount: number;
    maximumCount: number | null;
  };
  units: LivestockPatternUnit[];
  resolutionPolicy: {
    type: 'EXACT_DECOMPOSITION' | 'OPTIMIZED_COMBINATION' | 'ORDERED_PRIORITY' | 'SOURCE_DEFINED';
    tieBreakPolicyId?: string;
    remainderPolicyId?: string;
  };
  evidenceIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}

export interface LivestockCombinationRule {
  combinationRuleId: string;
  version: string;
  includedPatternUnitIds: string[];
  policy: string;
  evidenceIds: string[];
}

export interface LivestockRemainderRule {
  remainderRuleId: string;
  version: string;
  appliesToPatternId: string;
  conditions?: { all?: unknown[]; any?: unknown[]; not?: unknown[] };
  decision: {
    decisionType: 'IGNORE_REMAINDER' | 'APPLY_NEXT_BAND' | 'APPLY_SPECIFIC_COMBINATION' | 'DISPLAY_ALTERNATIVES' | 'REQUIRE_REVIEW';
    payload?: Record<string, unknown>;
  };
  evidenceIds: string[];
  governance: { status: 'DRAFT' | 'APPROVED' | 'PRODUCTION' };
}

export interface LivestockTieBreakPolicy {
  tieBreakPolicyId: string;
  version: string;
  madhhabScope: { appliesTo: string[] };
  policyType: 'PREFER_APPROVED_UNIT' | 'DISPLAY_ALL_VALID_OPTIONS' | 'SCHOLAR_REVIEW' | 'SOURCE_DEFINED';
  priorityOrder: string[];
  evidenceIds: string[];
  explanationIds: string[];
  governance: { status: 'DRAFT' | 'APPROVED' | 'PRODUCTION' };
}

export interface CanonicalLivestockSchedule {
  /** Format: ZAKAT-LIVESTOCK-<ANIMAL_TYPE>-<CONTEXT>-<SEQ> */
  scheduleId: string;
  version: string;
  schemaVersion: string;
  identity: {
    module: 'ZAKAT';
    ruleType: 'ZAKAT_LIVESTOCK_SCHEDULE';
    categoryId: CanonicalZakatCategoryId;
    animalTypeId: CanonicalAnimalTypeId;
    ruleFamilyId: string;
    topic: 'LIVESTOCK_ZAKAT';
    subtopic: string;
  };
  titles: { en: string; ha?: string; ar?: string };
  madhhabScope: LivestockScheduleMadhhabScope;
  eligibilityRuleIds: string[];
  scheduleModel: {
    modelType: LivestockScheduleModelType;
    bands: LivestockScheduleBand[];
    patterns: LivestockRepeatingPattern[];
    combinationRules: LivestockCombinationRule[];
    remainderRules: LivestockRemainderRule[];
  };
  obligationDefinitions: string[];
  exceptions: string[];
  execution: {
    stage: 'LIVESTOCK_SCHEDULE_RESOLUTION';
    priority: number;
    terminal: boolean;
    requiresPreviousRules?: string[];
    incompatibleWithRules?: string[];
  };
  references: {
    evidenceIds: string[];
    fiqhReferenceIds: string[];
    explanationIds: string[];
    sourceRecordIds: string[];
  };
  governance: {
    status: 'DRAFT' | 'ACADEMIC_REVIEW' | 'SHARIA_REVIEW' | 'TECHNICAL_VALIDATION' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
    effectiveFrom?: string;
    effectiveUntil?: string;
  };
  integrity: {
    contentChecksum: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
  };
}
