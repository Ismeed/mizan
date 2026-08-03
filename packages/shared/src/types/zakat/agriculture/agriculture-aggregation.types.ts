/**
 * MIZAN — Agriculture Aggregation Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';

export type AgricultureAggregationScope =
  | 'SAME_PRODUCE_TYPE'
  | 'SAME_PRODUCE_CATEGORY'
  | 'ALL_ZAKATABLE_PRODUCE'
  | 'MADHHAB_SPECIFIC';

export interface AgricultureAggregationPolicy {
  policyId: string;
  version: string;
  madhhabScope: {
    appliesTo: string[];
  };
  scope: AgricultureAggregationScope;
  description: string;
  evidenceIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
}

export interface AgricultureAggregatedResult {
  combinedQuantity: ExactFraction;
  aggregationPolicyId: string;
  harvestInstanceIds: string[];
  isAboveNisab: boolean;
}
