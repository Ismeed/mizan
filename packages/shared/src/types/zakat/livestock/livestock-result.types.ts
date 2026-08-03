/**
 * MIZAN — Livestock Calculation Result Contracts (Phase 9)
 *
 * Structured livestock result per asset instance and overall.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';
import type { CanonicalZakatCategoryId } from '../canonical-zakat-category.types';
import type { LivestockEligibilityResult } from './livestock-eligibility.types';
import type { LivestockScheduleModelType } from './livestock-schedule.types';
import type { LivestockObligationDefinition, LivestockObligationOption, LivestockMonetaryAlternative } from './livestock-obligation.types';

export type LivestockScheduleResolutionStatus =
  | 'RESOLVED'
  | 'NOT_DUE'
  | 'REVIEW_REQUIRED'
  | 'UNSUPPORTED'
  | 'CONFLICT'
  | 'GAP_DETECTED';

export interface LivestockScheduleResolution {
  scheduleId: string;
  scheduleVersion: string;
  scheduleModel: LivestockScheduleModelType;
  matchedBandId?: string | null;
  matchedPatternId?: string | null;
  resolvedCombination?: string[] | null;
  selectedMadhhab: string;
  resolvedScheduleChecksum: string;
}

export interface LivestockObligationAvailability {
  status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'UNKNOWN' | 'REVIEW_REQUIRED';
  userOwnedAnimalClasses?: string[];
}

export interface LivestockAssetResult {
  assetInstanceId: string;
  categoryId: CanonicalZakatCategoryId;
  categoryVersion: string;
  animalTypeId: CanonicalAnimalTypeId;
  animalTypeVersion: string;
  inputSummary: {
    totalCount: number;
    ownershipPeriod: Record<string, unknown>;
    feedingMethod: string;
    purposeClassification: string;
  };
  eligibility: LivestockEligibilityResult;
  scheduleResolution: LivestockScheduleResolution;
  obligation: {
    obligationType: string;
    obligationDefinitionId?: string;
    animalObligations: unknown[];
    alternativeOptions: LivestockObligationOption[];
    monetaryAlternative: LivestockMonetaryAlternative | null;
  };
  fulfilmentAvailability?: LivestockObligationAvailability;
  explanationIds: string[];
  evidence: Array<{
    evidenceId: string;
    evidenceVersion: string;
    referenceLabel: string;
    supports: string;
  }>;
  ruleResolution: {
    ruleFamilyId: string;
    baseRuleId: string;
    appliedOverrideIds: string[];
    parallelBranchId?: string | null;
  };
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
}

export interface LivestockCalculationResult {
  calculationId: string;
  calculationProfileId: string;
  selectedMadhhab: string;
  currencyCode: string;
  livestockResults: LivestockAssetResult[];
  hasReviewRequiredCase: boolean;
  calculatedAt: string;
}
