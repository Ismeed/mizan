/**
 * MIZAN — Zakat Module Result Contract (Phase 13)
 * Represents the complete Zakat module calculation result structure.
 */

import type { MoneyValue } from '../currency/money.types';

export interface ZakatAssetCategorization {
  entered: string[];
  normalized: string[];
  excluded: string[];
  reviewRequired: string[];
}

export interface ZakatCategoriesSummary {
  categoryResults: string[];
}

export interface ZakatAggregationSummary {
  aggregationGroups: string[];
  appliedRules: string[];
}

export interface ZakatNisabSummary {
  nisabResults: string[];
}

export interface ZakatObligationsSummary {
  monetaryObligations: string[];
  physicalObligations: string[];
  livestockObligations: string[];
  agricultureObligations: string[];
  reviewRequiredObligations: string[];
}

export interface ZakatTotalsSummary {
  monetaryTotalsByCurrency: MoneyValue[];
  physicalObligationCount: number;
  livestockObligationCount: number;
}

export interface ZakatModuleSnapshots {
  zakatResolutionSnapshotId: string;
  monetaryCalculationSnapshotId: string;
}

export interface ZakatModuleResult {
  module: 'ZAKAT';
  assets: ZakatAssetCategorization;
  categories: ZakatCategoriesSummary;
  aggregation: ZakatAggregationSummary;
  nisab: ZakatNisabSummary;
  obligations: ZakatObligationsSummary;
  totals: ZakatTotalsSummary;
  snapshots: ZakatModuleSnapshots;
}
