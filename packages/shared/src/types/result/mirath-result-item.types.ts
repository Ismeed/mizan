/**
 * MIZAN — Mirath Result Item Payloads (Phase 13)
 * Strongly-typed decision payloads for Mirath result items.
 */

export interface HijabBlockerRef {
  blockerHeirId: string;
  blockerInstanceId?: string | null;
  hijabRuleId: string;
  hijabRuleVersion: string;
}

export interface HijabResultPayload {
  hijabType: 'COMPLETE_EXCLUSION' | 'PARTIAL_REDUCTION';
  blockedBy: HijabBlockerRef[];
  removeFromShareDistribution: boolean;
  retainInCaseRecord: boolean;
  reducedFractionNumerator?: number | null;
  reducedFractionDenominator?: number | null;
}

export interface FixedShareResultPayload {
  eligibilityStatus: 'ELIGIBLE' | 'INELIGIBLE';
  hijabStatus: 'NOT_BLOCKED' | 'PARTIALLY_BLOCKED' | 'COMPLETELY_BLOCKED';
  inheritanceStatus: 'FIXED_SHARE';
  count: number;
  shareClassification: 'FARD';
  distributionRelationship: 'EQUAL_SHARE' | 'SINGLE_SHARE';
}

export interface ResiduaryResultPayload {
  eligibilityStatus: 'ELIGIBLE';
  hijabStatus: 'NOT_BLOCKED';
  inheritanceStatus: 'RESIDUARY';
  residuaryClass: 'ASABAH_BIN_NAFS' | 'ASABAH_BIL_GHAIR' | 'ASABAH_MAL_GHAIR';
  count: number;
  maleCount?: number;
  femaleCount?: number;
  distributionRelationship: 'EQUAL_SHARE' | 'MALE_DOUBLE_FEMALE';
}

export interface HeirDistributionResultPayload {
  eligibilityStatus: 'ELIGIBLE';
  hijabStatus: 'NOT_BLOCKED';
  inheritanceStatus: 'FIXED_SHARE' | 'RESIDUARY' | 'HYBRID';
  count: number;
  perPersonAmountMinor?: string;
}

export interface BlockedHeirResultPayload {
  eligibilityStatus: 'INELIGIBLE' | 'BLOCKED';
  hijabStatus: 'COMPLETELY_BLOCKED';
  inheritanceStatus: 'NONE';
  count: number;
  blockedBy: HijabBlockerRef[];
}

export interface EstatePreparationResultPayload {
  grossEstateMinor: string;
  approvedDeductionsMinor: string;
  netEstateMinor: string;
  debtsMinor: string;
  funeralExpensesMinor: string;
  wasiyyahMinor: string;
  wasiyyahApprovedFraction?: { numerator: number; denominator: number };
}
