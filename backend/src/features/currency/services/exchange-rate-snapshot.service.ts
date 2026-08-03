/**
 * Exchange Rate Snapshot Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Immutably stores and validates approved exchange rate snapshots.
 */

import crypto from 'crypto';
import { ExchangeRateSnapshot } from '@mizan/shared';

export class ExchangeRateSnapshotService {
  private static snapshotStore: Map<string, ExchangeRateSnapshot> = new Map();

  public static createSnapshot(input: {
    sourceCurrencyCode: string;
    targetCurrencyCode: string;
    rateValue: string; // Exact decimal string
    rateDate: string;  // YYYY-MM-DD
    providerId: string;
    providerRateId?: string;
    sourceType?: 'OFFICIAL' | 'LICENSED_PROVIDER' | 'MANUAL_APPROVED_ENTRY' | 'HISTORICAL_ARCHIVE';
    ratePolicyId?: string;
    providerPayloadHash?: string;
  }): ExchangeRateSnapshot {
    const src = input.sourceCurrencyCode.toUpperCase();
    const tgt = input.targetCurrencyCode.toUpperCase();
    const snapshotId = `EXCH-SNAP-${crypto.randomUUID()}`;
    const retrievedAt = new Date().toISOString();
    const ratePolicyId = input.ratePolicyId || 'EXCHANGE-RATE-POLICY-001';
    const sourceType = input.sourceType || 'OFFICIAL';

    const checksumPayload = JSON.stringify({
      snapshotId,
      sourceCurrencyCode: src,
      targetCurrencyCode: tgt,
      rateValue: input.rateValue,
      rateDirection: 'TARGET_UNITS_PER_SOURCE_UNIT',
      rateDate: input.rateDate,
      providerId: input.providerId,
      ratePolicyId,
    });

    const snapshotChecksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    const snapshot: ExchangeRateSnapshot = {
      exchangeRateSnapshotId: snapshotId,
      sourceCurrencyCode: src,
      targetCurrencyCode: tgt,
      rate: {
        value: input.rateValue,
        direction: 'TARGET_UNITS_PER_SOURCE_UNIT',
      },
      rateDate: input.rateDate,
      retrievedAt,
      rateSource: {
        providerId: input.providerId,
        providerRateId: input.providerRateId,
        sourceType,
      },
      policy: {
        ratePolicyId,
        ratePolicyVersion: '1.0.0',
      },
      integrity: {
        providerPayloadChecksum: input.providerPayloadHash,
        snapshotChecksum,
      },
      isImmutable: true,
    };

    this.snapshotStore.set(snapshotId, snapshot);
    return snapshot;
  }

  public static getSnapshot(snapshotId: string): ExchangeRateSnapshot | null {
    return this.snapshotStore.get(snapshotId) || null;
  }

  public static findApprovedSnapshot(
    sourceCurrencyCode: string,
    targetCurrencyCode: string,
    rateDate?: string
  ): ExchangeRateSnapshot | null {
    const src = sourceCurrencyCode.toUpperCase();
    const tgt = targetCurrencyCode.toUpperCase();

    // 1-to-1 identity conversion
    if (src === tgt) {
      return this.createSnapshot({
        sourceCurrencyCode: src,
        targetCurrencyCode: tgt,
        rateValue: '1.00000000',
        rateDate: rateDate || new Date().toISOString().split('T')[0],
        providerId: 'SYSTEM_IDENTITY',
      });
    }

    for (const snap of this.snapshotStore.values()) {
      if (
        snap.sourceCurrencyCode === src &&
        snap.targetCurrencyCode === tgt &&
        (!rateDate || snap.rateDate === rateDate)
      ) {
        return snap;
      }
    }

    return null;
  }
}
