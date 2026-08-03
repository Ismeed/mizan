/**
 * Cross Rate Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Computes two-leg cross rates through approved intermediate currencies (e.g., USD, EUR).
 */

import crypto from 'crypto';
import Decimal from 'decimal.js';
import { CrossRateSnapshot, ExchangeRateSnapshot } from '@mizan/shared';
import { ExchangeRateSnapshotService } from './exchange-rate-snapshot.service';

export class CrossRateService {
  /** Approved intermediate currencies */
  private static APPROVED_INTERMEDIATE_CURRENCIES = new Set(['USD', 'EUR']);

  public static computeCrossRate(
    leg1: ExchangeRateSnapshot,
    leg2: ExchangeRateSnapshot
  ): CrossRateSnapshot {
    if (leg1.targetCurrencyCode !== leg2.sourceCurrencyCode) {
      throw new Error(
        `CROSS_RATE_MISMATCH: Leg 1 target '${leg1.targetCurrencyCode}' must match Leg 2 source '${leg2.sourceCurrencyCode}'`
      );
    }

    const intermediateCode = leg1.targetCurrencyCode;
    if (!this.APPROVED_INTERMEDIATE_CURRENCIES.has(intermediateCode)) {
      throw new Error(
        `UNAPPROVED_INTERMEDIATE_CURRENCY: '${intermediateCode}' is not an approved cross-rate intermediate currency`
      );
    }

    const val1 = new Decimal(leg1.rate.value);
    const val2 = new Decimal(leg2.rate.value);
    const crossValue = val1.mul(val2).toFixed(12);

    const crossRateSnapshotId = `CROSS-SNAP-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const checksumPayload = JSON.stringify({
      crossRateSnapshotId,
      sourceCurrencyCode: leg1.sourceCurrencyCode,
      intermediateCurrencyCode: intermediateCode,
      targetCurrencyCode: leg2.targetCurrencyCode,
      crossValue,
      leg1Id: leg1.exchangeRateSnapshotId,
      leg2Id: leg2.exchangeRateSnapshotId,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    // Register synthetic snapshot for cross rate
    ExchangeRateSnapshotService.createSnapshot({
      sourceCurrencyCode: leg1.sourceCurrencyCode,
      targetCurrencyCode: leg2.targetCurrencyCode,
      rateValue: crossValue,
      rateDate: leg1.rateDate,
      providerId: 'CROSS_RATE_DERIVED',
      sourceType: 'OFFICIAL',
    });

    return {
      crossRateSnapshotId,
      sourceCurrencyCode: leg1.sourceCurrencyCode,
      intermediateCurrencyCode: intermediateCode,
      targetCurrencyCode: leg2.targetCurrencyCode,
      legs: [
        {
          exchangeRateSnapshotId: leg1.exchangeRateSnapshotId,
          sourceCurrencyCode: leg1.sourceCurrencyCode,
          targetCurrencyCode: leg1.targetCurrencyCode,
          rateValue: leg1.rate.value,
        },
        {
          exchangeRateSnapshotId: leg2.exchangeRateSnapshotId,
          sourceCurrencyCode: leg2.sourceCurrencyCode,
          targetCurrencyCode: leg2.targetCurrencyCode,
          rateValue: leg2.rate.value,
        },
      ],
      crossRate: {
        value: crossValue,
        direction: 'TARGET_UNITS_PER_SOURCE_UNIT',
      },
      policyId: 'CROSS-RATE-POLICY-001',
      checksum,
      createdAt,
    };
  }
}
