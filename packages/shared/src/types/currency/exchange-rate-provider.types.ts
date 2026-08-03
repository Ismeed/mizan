/**
 * MIZAN — Exchange Rate Provider & Policy Types (Phase 12)
 */

export type ProviderType =
  | 'CENTRAL_BANK'
  | 'COMMERCIAL_PROVIDER'
  | 'INSTITUTIONAL_SOURCE'
  | 'MANUAL_APPROVED_SOURCE';

export type RateFallbackMode =
  | 'NO_FALLBACK'
  | 'NEXT_APPROVED_PROVIDER'
  | 'MANUAL_APPROVED_RATE'
  | 'REVIEW_REQUIRED';

export type RateDatePolicy =
  | 'VALUATION_DATE'
  | 'CALCULATION_DATE'
  | 'USER_SELECTED_APPROVED_DATE';

export interface ExchangeRateProvider {
  providerId: string;
  version: string;
  name: string;
  providerType: ProviderType;
  supportedCurrencies: string[];
  historicalRatesSupported: boolean;
  licenceStatus: string;
  availabilityStatus: 'ACTIVE' | 'SUSPENDED' | 'DEPRECATED';
  reliabilityPolicy: {
    maximumRateAgeHours: number;
    fallbackAllowed: boolean;
  };
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    effectiveFrom?: string;
  };
}

export interface ExchangeRatePolicy {
  ratePolicyId: string;
  version: string;
  sourcePriority: string[]; // Provider IDs in priority order
  fallbackMode: RateFallbackMode;
  datePolicy: RateDatePolicy;
  stalenessPolicy: {
    maximumAgeHours: number;
    weekendPolicy: 'USE_LAST_BUSINESS_DAY' | 'REJECT';
    holidayPolicy: 'USE_LAST_BUSINESS_DAY' | 'REJECT';
  };
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}
