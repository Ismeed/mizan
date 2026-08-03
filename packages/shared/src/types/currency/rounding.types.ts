/**
 * MIZAN — Monetary Rounding & Remainder Policy Types (Phase 12)
 */

import type { MadhhabCode } from '../profile.types';

export type MonetaryRoundingUsageScope =
  | 'MIRATH_DISTRIBUTION'
  | 'ZAKAT_MONETARY_AMOUNT'
  | 'CURRENCY_CONVERSION'
  | 'REPORT_DISPLAY';

export type MonetaryRoundingMethod =
  | 'ROUND_HALF_UP'
  | 'ROUND_HALF_EVEN'
  | 'ROUND_DOWN'
  | 'ROUND_UP'
  | 'TRUNCATE'
  | 'EXACT_NO_ROUNDING'
  | 'REVIEW_REQUIRED';

export type RoundingPrecisionSource =
  | 'CURRENCY_MINOR_UNITS'
  | 'POLICY_DEFINED_SCALE';

export interface MonetaryRoundingPolicy {
  roundingPolicyId: string;
  version: string;
  usageScope: MonetaryRoundingUsageScope[];
  method: MonetaryRoundingMethod;
  precisionSource: RoundingPrecisionSource;
  policyDefinedScale?: number;
  preserveUnroundedValue: boolean;
  remainderPolicyId?: string;
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}

export type RemainderPolicyType =
  | 'LARGEST_REMAINDER'
  | 'DISTRIBUTE_BY_APPROVED_PRIORITY'
  | 'RETAIN_AS_UNALLOCATED'
  | 'MANUAL_SETTLEMENT'
  | 'REVIEW_REQUIRED';

export interface MonetaryRemainderPolicy {
  remainderPolicyId: string;
  version: string;
  policyType: RemainderPolicyType;
  conditions?: Record<string, any>;
  madhhabScope: {
    appliesTo: MadhhabCode[];
  };
  explanationIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}
