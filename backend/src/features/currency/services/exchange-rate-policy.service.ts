/**
 * Exchange Rate Policy Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { ExchangeRatePolicy } from '@mizan/shared';

export const BASELINE_RATE_POLICIES: ExchangeRatePolicy[] = [
  {
    ratePolicyId: 'EXCHANGE-RATE-POLICY-001',
    version: '1.0.0',
    sourcePriority: ['CENTRAL_BANK_NIGERIA', 'ECB_OFFICIAL_RATES'],
    fallbackMode: 'NEXT_APPROVED_PROVIDER',
    datePolicy: 'VALUATION_DATE',
    stalenessPolicy: {
      maximumAgeHours: 48,
      weekendPolicy: 'USE_LAST_BUSINESS_DAY',
      holidayPolicy: 'USE_LAST_BUSINESS_DAY',
    },
    governance: {
      status: 'APPROVED',
    },
  },
];

export class ExchangeRatePolicyService {
  private static policyMap: Map<string, ExchangeRatePolicy> = new Map();

  static {
    for (const pol of BASELINE_RATE_POLICIES) {
      this.policyMap.set(pol.ratePolicyId, pol);
    }
  }

  public static getPolicy(ratePolicyId: string): ExchangeRatePolicy | null {
    return this.policyMap.get(ratePolicyId) || null;
  }

  public static getDefaultPolicy(): ExchangeRatePolicy {
    return BASELINE_RATE_POLICIES[0];
  }
}
