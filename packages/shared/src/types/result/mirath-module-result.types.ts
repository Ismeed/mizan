/**
 * MIZAN — Mirath Module Result Contract (Phase 13)
 * Represents the complete Mirath module calculation result structure.
 */

import type { MoneyValue } from '../currency/money.types';

export interface MirathEstateSummary {
  grossEstate: MoneyValue[];
  approvedDeductions: MoneyValue[];
  netDistributableEstate: MoneyValue[];
  currencyMode: string;
  estateSnapshotId: string;
}

export interface MirathHeirCategorization {
  entered: string[];
  eligible: string[];
  blocked: string[];
  partiallyAffected: string[];
  reviewRequired: string[];
}

export interface MirathSharesSummary {
  fixedShareResults: string[];
  residuaryResults: string[];
  adjustmentResults: string[];
}

export interface MirathDistributionSummary {
  heirDistributions: string[];
  totalDistributed: MoneyValue[];
  monetaryRemainder: MoneyValue[];
  reconciliationStatus: 'RECONCILED' | 'RECONCILED_WITH_ROUNDING' | 'NOT_RECONCILED' | 'REVIEW_REQUIRED';
}

export interface MirathModuleSnapshots {
  hijabResolutionSnapshotId: string;
  shareResolutionSnapshotId: string;
  monetaryCalculationSnapshotId: string;
}

export interface MirathModuleResult {
  module: 'MIRATH';
  estate: MirathEstateSummary;
  heirs: MirathHeirCategorization;
  shares: MirathSharesSummary;
  distribution: MirathDistributionSummary;
  snapshots: MirathModuleSnapshots;
}
