/**
 * MIZAN — Exchange Rate & Rate Snapshot Types (Phase 12)
 */

export type ExchangeRateDirection = 'TARGET_UNITS_PER_SOURCE_UNIT';

export type RateSourceType =
  | 'OFFICIAL'
  | 'LICENSED_PROVIDER'
  | 'MANUAL_APPROVED_ENTRY'
  | 'HISTORICAL_ARCHIVE';

export interface RateSourceInfo {
  providerId: string;
  providerRateId?: string;
  sourceType: RateSourceType;
  sourceReference?: string;
}

export interface ExchangeRateValue {
  value: string; // Exact decimal string e.g. "1500.00000000"
  direction: ExchangeRateDirection;
}

export interface ExchangeRateSnapshot {
  exchangeRateSnapshotId: string;
  sourceCurrencyCode: string;
  targetCurrencyCode: string;
  rate: ExchangeRateValue;
  rateDate: string; // ISO 8601 YYYY-MM-DD
  retrievedAt: string; // ISO 8601 timestamp
  rateSource: RateSourceInfo;
  policy: {
    ratePolicyId: string;
    ratePolicyVersion: string;
  };
  integrity: {
    providerPayloadChecksum?: string;
    snapshotChecksum: string;
  };
  isImmutable: boolean;
}

export interface CrossRateLeg {
  exchangeRateSnapshotId: string;
  sourceCurrencyCode: string;
  targetCurrencyCode: string;
  rateValue: string;
}

export interface CrossRateSnapshot {
  crossRateSnapshotId: string;
  sourceCurrencyCode: string;
  intermediateCurrencyCode: string;
  targetCurrencyCode: string;
  legs: CrossRateLeg[];
  crossRate: ExchangeRateValue;
  policyId: string;
  checksum: string;
  createdAt: string;
}

export interface InverseRateDerivation {
  derivedRateSnapshotId: string;
  derivedFromSnapshotId: string;
  derivationMethod: 'MATHEMATICAL_INVERSION';
  precisionPolicyId: string;
  inverseRate: ExchangeRateValue;
  checksum: string;
}

export interface ManualRateEntry {
  manualRateEntryId: string;
  sourceCurrencyCode: string;
  targetCurrencyCode: string;
  rate: ExchangeRateValue;
  rateDate: string;
  sourceDocumentId?: string;
  sourceDescription: string;
  enteredBy: string;
  approvedBy: string[];
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  reason: string;
  checksum: string;
  createdAt: string;
}
