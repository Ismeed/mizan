/**
 * MIZAN — Baseline Rounding Policies Registry (Phase 12)
 */

import { MonetaryRoundingPolicy } from '../types/currency/rounding.types';

export const BASELINE_ROUNDING_POLICIES: MonetaryRoundingPolicy[] = [
  {
    roundingPolicyId: 'MONEY-ROUNDING-STANDARD-001',
    version: '1.0.0',
    usageScope: [
      'MIRATH_DISTRIBUTION',
      'ZAKAT_MONETARY_AMOUNT',
      'CURRENCY_CONVERSION',
      'REPORT_DISPLAY',
    ],
    method: 'ROUND_HALF_UP',
    precisionSource: 'CURRENCY_MINOR_UNITS',
    preserveUnroundedValue: true,
    remainderPolicyId: 'MIRATH-MONETARY-REMAINDER-001',
    governance: {
      status: 'APPROVED',
    },
  },
];
