/**
 * MIZAN — Agriculture Result Contracts (Phase 10)
 */

import type { CanonicalZakatCategoryId } from '../canonical-zakat-category.types';
import type { AgricultureProduceTypeId } from './agriculture-produce-type.types';
import type { AgricultureEligibilityResult } from './agriculture-eligibility.types';
import type { AgricultureObligationDefinition } from './agriculture-obligation.types';
import type { AgricultureIrrigationMethod } from './agriculture-irrigation.types';
import type { ExactFraction } from '../../../utils/fraction.utils';

export type AgricultureScheduleResolutionStatus =
  | 'RESOLVED'
  | 'NOT_DUE'
  | 'BELOW_NISAB'
  | 'REVIEW_REQUIRED'
  | 'UNSUPPORTED'
  | 'CONFLICT'
  | 'AGGREGATION_APPLIED'
  | 'MIXED_RATE_APPLIED';

export interface AgricultureAssetResult {
  assetInstanceId: string;
  categoryId: CanonicalZakatCategoryId; // 'AGRICULTURAL_PRODUCE'
  categoryVersion: string;
  produceTypeId: AgricultureProduceTypeId;
  produceTypeVersion: string;
  inputSummary: {
    harvestQuantity: ExactFraction;
    quantityUnit: string;
    irrigationMethod: AgricultureIrrigationMethod;
    harvestDate: string;
  };
  eligibility: AgricultureEligibilityResult;
  nisabResolution: {
    nisabId: string;
    thresholdQuantity: ExactFraction;
    unit: string;
    isAboveNisab: boolean;
    selectedMadhhab: string;
  };
  rateResolution: {
    rateId: string;
    appliedRate: ExactFraction; // 1/10 or 1/20 or mixed fraction
    irrigationMethod: AgricultureIrrigationMethod;
  };
  obligation: AgricultureObligationDefinition;
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
  };
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
}

export interface AgricultureCalculationResult {
  calculationId: string;
  harvestResults: AgricultureAssetResult[];
  aggregateSummary?: {
    totalHarvestsEvaluated: number;
    totalZakatableProduce: ExactFraction;
    unit: string;
    overallEligibilityStatus: string;
  };
}
