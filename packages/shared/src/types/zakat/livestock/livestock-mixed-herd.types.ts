/**
 * MIZAN — Livestock Mixed Herd & Joint Ownership Rules (Phase 9)
 *
 * Separate structured models for mixed herd aggregation and joint ownership.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';

export interface LivestockMixedHerdRule {
  mixedHerdRuleId: string;
  version: string;
  includedAnimalTypeIds: CanonicalAnimalTypeId[];
  madhhabScope: {
    appliesTo: string[];
  };
  aggregationConditions: {
    all?: unknown[];
    any?: unknown[];
    not?: unknown[];
  };
  decision: {
    decisionType: 'COMBINE_COUNTS' | 'KEEP_SEPARATE' | 'PARTIAL_COMBINATION' | 'REQUIRE_REVIEW';
    payload?: Record<string, unknown>;
  };
  evidenceIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
  };
}

export interface LivestockJointOwnershipRule {
  jointOwnershipRuleId: string;
  version: string;
  animalTypeIds: CanonicalAnimalTypeId[];
  madhhabScope: {
    appliesTo: string[];
  };
  conditions: Record<string, unknown>;
  ownershipResolution: {
    method: 'AGGREGATE_AND_DIVIDE' | 'INDIVIDUAL_SHARE_ONLY' | 'PARTNER_JOINT_THRESHOLD' | 'SCHOLAR_REVIEW';
    payload?: Record<string, unknown>;
  };
  scheduleInputTransformation: Record<string, unknown>;
  evidenceIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
  };
}
