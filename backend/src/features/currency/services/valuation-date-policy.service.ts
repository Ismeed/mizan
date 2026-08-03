/**
 * Valuation Date Policy Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { BASELINE_VALUATION_DATE_POLICIES, ValuationDatePolicy } from '@mizan/shared';

export class ValuationDatePolicyService {
  private static policyMap: Map<string, ValuationDatePolicy> = new Map();

  static {
    for (const pol of BASELINE_VALUATION_DATE_POLICIES) {
      this.policyMap.set(pol.valuationDatePolicyId, pol);
    }
  }

  public static getPolicy(policyId: string): ValuationDatePolicy | null {
    return this.policyMap.get(policyId) || null;
  }

  public static resolveValuationDate(
    scope: 'MIRATH_ESTATE' | 'ZAKAT_CALCULATION' | 'HISTORICAL_REPORT',
    dateInput?: string
  ): { valuationDate: string; policyId: string } {
    const policyId =
      scope === 'MIRATH_ESTATE' ? 'VALUATION-DATE-MIRATH-001' : 'VALUATION-DATE-ZAKAT-001';

    const valuationDate = dateInput || new Date().toISOString().split('T')[0];

    return { valuationDate, policyId };
  }
}
