/**
 * MIZAN — Valuation Date & Asset Valuation Types (Phase 12)
 */

import type { MadhhabCode } from '../profile.types';
import type { MoneyValue } from './money.types';

export type ValuationDateUsageScope =
  | 'MIRATH_ESTATE'
  | 'ZAKAT_CALCULATION'
  | 'HISTORICAL_REPORT'
  | 'MONETARY_EQUIVALENT';

export type ValuationDateBasis =
  | 'DATE_OF_DEATH'
  | 'CALCULATION_DATE'
  | 'ZAKAT_ASSESSMENT_DATE'
  | 'HARVEST_DATE'
  | 'USER_SELECTED_APPROVED_DATE'
  | 'REVIEW_REQUIRED';

export interface ValuationDatePolicy {
  valuationDatePolicyId: string;
  version: string;
  usageScope: ValuationDateUsageScope;
  dateBasis: ValuationDateBasis;
  timezonePolicy: string;
  madhhabScope: {
    appliesTo: MadhhabCode[];
  };
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}

export type ValuationSourceType =
  | 'MARKET_PROVIDER'
  | 'DOCUMENTED_APPRAISAL'
  | 'USER_DECLARED_VALUE'
  | 'MANUAL_APPROVED_SOURCE';

export interface AssetValuationSnapshot {
  valuationSnapshotId: string;
  assetInstanceId: string;
  categoryId: string;
  valuationMethodRuleId: string;
  valuationMethodRuleVersion: string;
  quantity?: {
    value: string;
    unitId: string;
  } | null;
  unitPrice?: MoneyValue | null;
  totalValue: MoneyValue;
  valuationDate: string;
  valuationSource: {
    sourceId: string;
    sourceType: ValuationSourceType;
  };
  selectedMadhhab: MadhhabCode;
  knowledgeReleaseVersion: string;
  checksum: string;
  isImmutable: boolean;
}

export interface MarketPriceProvider {
  providerId: string;
  dataType: 'PRECIOUS_METALS' | 'SECURITIES' | 'AGRICULTURE_PRODUCE' | 'LIVESTOCK';
  coverage: string[];
  licenceStatus: string;
  availabilityStatus: 'ACTIVE' | 'SUSPENDED';
}

export interface MarketPriceSnapshot {
  marketPriceSnapshotId: string;
  providerId: string;
  assetIdentifier: string; // e.g. "GOLD_GRAM_24K", "SILVER_GRAM_999"
  unitPrice: MoneyValue;
  priceDate: string;
  retrievedAt: string;
  checksum: string;
}

export interface NisabValuationSnapshot {
  nisabValuationSnapshotId: string;
  nisabMethodRuleId: string;
  referenceAssetId: string; // "GOLD" | "SILVER"
  referenceQuantity: {
    value: string;
    unitId: string;
  };
  unitPriceSnapshotId: string;
  nisabMoneyValue: MoneyValue;
  valuationDate: string;
  selectedMadhhab: MadhhabCode;
  checksum: string;
  createdAt: string;
}
