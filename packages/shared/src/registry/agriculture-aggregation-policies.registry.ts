/**
 * MIZAN — Baseline Synthetic Agriculture Aggregation Policies Registry (Phase 10)
 *
 * ALL records are synthetic fixtures tagged TEST_ONLY_FIXTURE.
 */

import type { AgricultureAggregationPolicy } from '../types/zakat/agriculture/agriculture-aggregation.types';

export const BASELINE_SYNTHETIC_AGRICULTURE_AGGREGATION_POLICIES: AgricultureAggregationPolicy[] = [
  {
    policyId: 'ZAKAT-AGRI-AGG-SAME-TYPE-001',
    version: '1.0.0',
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    scope: 'SAME_PRODUCE_TYPE',
    description: 'Combine multiple harvests of the same produce type within the same season to reach Nisab.',
    evidenceIds: ['EVID-AGRI-AGGREGATION-SAME-TYPE-SYNTHETIC'],
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
  },
];
