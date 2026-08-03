/**
 * Market Price Service
 * Phase 12 — MIZAN Currency Architecture
 */

import crypto from 'crypto';
import { MarketPriceProvider, MarketPriceSnapshot, MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

export const BASELINE_MARKET_PRICE_PROVIDERS: MarketPriceProvider[] = [
  {
    providerId: 'LBMA_GOLD_SILVER_OFFICIAL',
    dataType: 'PRECIOUS_METALS',
    coverage: ['GOLD_GRAM_24K', 'SILVER_GRAM_999'],
    licenceStatus: 'LICENSED',
    availabilityStatus: 'ACTIVE',
  },
];

export class MarketPriceService {
  private static snapshotStore: Map<string, MarketPriceSnapshot> = new Map();

  public static createPriceSnapshot(input: {
    providerId: string;
    assetIdentifier: string; // e.g. "GOLD_GRAM_24K", "SILVER_GRAM_999"
    priceAmountDecimal: string;
    currencyCode: string;
    priceDate: string;
  }): MarketPriceSnapshot {
    const snapshotId = `MKT-SNAP-${crypto.randomUUID()}`;
    const retrievedAt = new Date().toISOString();
    const money = MoneyArithmeticService.createMoney(input.priceAmountDecimal, input.currencyCode);

    const checksumPayload = JSON.stringify({
      snapshotId,
      providerId: input.providerId,
      assetIdentifier: input.assetIdentifier,
      priceAmountMinor: money.amountMinor,
      currencyCode: money.currencyCode,
      priceDate: input.priceDate,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    const snapshot: MarketPriceSnapshot = {
      marketPriceSnapshotId: snapshotId,
      providerId: input.providerId,
      assetIdentifier: input.assetIdentifier,
      unitPrice: money,
      priceDate: input.priceDate,
      retrievedAt,
      checksum,
    };

    this.snapshotStore.set(snapshotId, snapshot);
    return snapshot;
  }

  public static getSnapshot(snapshotId: string): MarketPriceSnapshot | null {
    return this.snapshotStore.get(snapshotId) || null;
  }
}
