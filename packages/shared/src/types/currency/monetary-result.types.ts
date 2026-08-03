/**
 * MIZAN — Monetary Calculation Result & Snapshot Types (Phase 12)
 */

import type { Fraction } from '../../utils/fraction.utils';
import type { MoneyValue } from './money.types';
import type { ExchangeRateSnapshot } from './exchange-rate.types';
import type { AssetValuationSnapshot } from './valuation.types';

export interface HeirMonetaryAllocation {
  heirId: string;
  heirType: string;
  count: number;
  share: Fraction;
  unroundedAllocationDecimal: string;
  finalMoney: MoneyValue;
  roundingAdjustmentMinor: string;
  appliedRuleIds: string[];
}

export interface MirathMonetaryDistribution {
  calculationId: string;
  netEstate: {
    currencyMode: string;
    originalAssets: any[];
    calculationCurrencyCode: string;
    convertedNetEstate: MoneyValue;
  };
  heirDistributions: HeirMonetaryAllocation[];
  reconciliation: {
    totalDistributedMinor: string;
    remainderMinor: string;
    remainderPolicyId: string;
  };
}

export interface ZakatMonetaryResult {
  categoryId: string;
  inputValues: {
    originalMoney: MoneyValue;
    conversionSnapshotId?: string | null;
    normalizedMoney: MoneyValue;
  }[];
  zakatBase: MoneyValue;
  religiousRate: Fraction;
  unroundedObligationDecimal: string;
  finalObligation: MoneyValue;
  roundingPolicyId: string;
  appliedRuleIds: string[];
  evidenceIds: string[];
  nonMonetaryObligation?: {
    obligationType: 'ANIMAL_DUE' | 'PHYSICAL_PRODUCE';
    details: any;
  } | null;
}

export interface ConversionStep {
  sequence: number;
  action: string;
  currencyCode?: string;
  exchangeRateSnapshotId?: string;
  result: string;
  timestamp: string;
}

export interface ConversionTrace {
  traceId: string;
  conversionRequestId: string;
  steps: ConversionStep[];
  checksum: string;
}

export interface CurrencyConversionRequest {
  conversionRequestId: string;
  calculationId?: string;
  sourceMoney: MoneyValue;
  targetCurrencyCode: string;
  valuationDate: string;
  conversionPurpose:
    | 'ESTATE_CONSOLIDATION'
    | 'ZAKAT_ASSET_AGGREGATION'
    | 'REPORT_RENDERING'
    | 'MONETARY_EQUIVALENT'
    | 'USER_REQUESTED_CONVERSION';
  ratePolicyId?: string;
  requestedAt: string;
}

export interface MissingRateResponse {
  status: 'EXCHANGE_RATE_UNAVAILABLE';
  sourceCurrencyCode: string;
  targetCurrencyCode: string;
  valuationDate: string;
  requiresUserAction: boolean;
  reviewRequired: boolean;
  message: string;
}

export interface ReportCurrencyConversion {
  renderingType: 'ALTERNATIVE_CURRENCY_REPORT';
  originalCalculationId: string;
  originalCurrencyCode: string;
  reportCurrencyCode: string;
  conversionSnapshotIds: string[];
  calculationLogicUnchanged: boolean;
  originalResultsPreserved: boolean;
}

export interface MonetaryCalculationSnapshot {
  snapshotId: string;
  calculationId: string;
  calculationProfileId: string;
  currencyContextId: string;
  originalMoneyValues: MoneyValue[];
  exchangeRateSnapshots: ExchangeRateSnapshot[];
  valuationSnapshots: AssetValuationSnapshot[];
  convertedMoneyValues: MoneyValue[];
  religiousValues: {
    fractions: Fraction[];
    rates: Fraction[];
    physicalObligations: any[];
  };
  roundingPolicies: string[];
  reconciliation: Record<string, any>;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  snapshotChecksum: string;
  createdAt: string;
  isImmutable: boolean;
}

export interface AICurrencyRestrictions {
  mustNotChangeReligiousShare: boolean;
  mustNotChangeZakatRate: boolean;
  mustNotInventExchangeRate: boolean;
  mustNotUseCurrentRateForHistoricalResult: boolean;
  mustNotPresentConversionAsReligiousRuling: boolean;
  mustNotSwitchCurrencySilently: boolean;
  mustUseProvidedMonetaryContext: boolean;
}

export interface AICurrencyContextPackage {
  task: 'EXPLAIN_MONETARY_RESULT';
  calculationContext: {
    calculationId: string;
    module: 'MIRATH' | 'ZAKAT';
    selectedMadhhab: string;
    languageTag: string;
    knowledgeReleaseVersion: string;
    ruleEngineVersion: string;
  };
  religiousContext: {
    shareOrRate: Fraction;
    appliedRuleIds: string[];
    evidenceIds: string[];
  };
  currencyContext: {
    sourceMoney: MoneyValue;
    targetMoney?: MoneyValue | null;
    calculationCurrencyCode: string;
    exchangeRateSnapshot?: ExchangeRateSnapshot | null;
    roundingPolicyId: string;
    valuationDate: string;
  };
  restrictions: AICurrencyRestrictions;
}
