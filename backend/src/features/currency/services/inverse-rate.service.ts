/**
 * Inverse Rate Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Mathematically derives inverse rate when direct rate snapshot is available.
 * Preserves original snapshot reference and marks rate as derived.
 */

import crypto from 'crypto';
import Decimal from 'decimal.js';
import { ExchangeRateSnapshot, InverseRateDerivation } from '@mizan/shared';
import { ExchangeRateSnapshotService } from './exchange-rate-snapshot.service';

export class InverseRateService {
  public static deriveInverseRate(
    directSnapshot: ExchangeRateSnapshot
  ): { inverseSnapshot: ExchangeRateSnapshot; derivation: InverseRateDerivation } {
    const directValue = new Decimal(directSnapshot.rate.value);
    if (directValue.isZero() || directValue.isNegative()) {
      throw new Error('INVALID_DIRECT_RATE: Cannot derive inverse from zero or negative rate');
    }

    // 1 / directValue rounded to 12 decimal places
    const inverseValue = new Decimal(1).div(directValue).toFixed(12);

    const derivedSnapshotId = `EXCH-SNAP-INV-${crypto.randomUUID()}`;

    const checksumPayload = JSON.stringify({
      derivedSnapshotId,
      originalSnapshotId: directSnapshot.exchangeRateSnapshotId,
      sourceCurrencyCode: directSnapshot.targetCurrencyCode,
      targetCurrencyCode: directSnapshot.sourceCurrencyCode,
      inverseValue,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    const inverseSnapshot = ExchangeRateSnapshotService.createSnapshot({
      sourceCurrencyCode: directSnapshot.targetCurrencyCode,
      targetCurrencyCode: directSnapshot.sourceCurrencyCode,
      rateValue: inverseValue,
      rateDate: directSnapshot.rateDate,
      providerId: `${directSnapshot.rateSource.providerId}_DERIVED_INVERSE`,
      sourceType: directSnapshot.rateSource.sourceType,
      ratePolicyId: directSnapshot.policy.ratePolicyId,
    });

    const derivation: InverseRateDerivation = {
      derivedRateSnapshotId: derivedSnapshotId,
      derivedFromSnapshotId: directSnapshot.exchangeRateSnapshotId,
      derivationMethod: 'MATHEMATICAL_INVERSION',
      precisionPolicyId: 'PRECISION-STANDARD-12DEC',
      inverseRate: {
        value: inverseValue,
        direction: 'TARGET_UNITS_PER_SOURCE_UNIT',
      },
      checksum,
    };

    return { inverseSnapshot, derivation };
  }
}
