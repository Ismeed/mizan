/**
 * MIZAN — Calculation Currency Context Types (Phase 12)
 */

import type { MoneyValue } from './money.types';

export type CurrencyMode =
  | 'SINGLE_CURRENCY'
  | 'MULTI_CURRENCY'
  | 'CONSOLIDATED'
  | 'HYBRID';

export type EstateCurrencyMode =
  | 'PRESERVE_SOURCE_CURRENCIES'
  | 'CONSOLIDATE_TO_CALCULATION_CURRENCY'
  | 'HYBRID_DISTRIBUTION'
  | 'REVIEW_REQUIRED';

export interface CalculationCurrencyContext {
  currencyContextId: string;
  calculationId: string;
  calculationProfileId: string;
  preferredCurrencyCode: string;
  calculationCurrencyCode: string;
  reportCurrencyCode: string;
  currencyMode: CurrencyMode;
  registryVersions: {
    currencyRegistryVersion: string;
    exchangeRatePolicyVersion: string;
    roundingPolicyVersion: string;
  };
  valuationDatePolicyId: string;
  createdAt: string;
  frozenAt?: string | null;
  checksum: string;
  isImmutable: boolean;
}

export interface CurrencyOverrideRecord {
  selected: string;
  resolved: string;
  source: 'CALCULATION_OVERRIDE' | 'USER_PREFERRED' | 'SYSTEM_DEFAULT';
}

export interface EstateItemInput {
  estateItemId: string;
  assetTypeId: string;
  description?: string;
  originalValue: MoneyValue;
}
