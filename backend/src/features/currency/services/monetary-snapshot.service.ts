/**
 * Monetary Snapshot Service
 * Phase 12 — MIZAN Currency Architecture
 */

import crypto from 'crypto';
import { MonetaryCalculationSnapshot } from '@mizan/shared';

export class MonetarySnapshotService {
  private static snapshotStore: Map<string, MonetaryCalculationSnapshot> = new Map();

  public static createSnapshot(input: {
    calculationId: string;
    calculationProfileId: string;
    currencyContextId: string;
    originalMoneyValues: any[];
    exchangeRateSnapshots: any[];
    valuationSnapshots: any[];
    convertedMoneyValues: any[];
    religiousValues: { fractions: any[]; rates: any[]; physicalObligations: any[] };
    roundingPolicies: string[];
    reconciliation: Record<string, any>;
    knowledgeReleaseVersion?: string;
    ruleEngineVersion?: string;
  }): MonetaryCalculationSnapshot {
    const snapshotId = `MON-SNAP-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();
    const knowledgeReleaseVersion = input.knowledgeReleaseVersion || '2.0.0';
    const ruleEngineVersion = input.ruleEngineVersion || '1.0.0';

    const checksumPayload = JSON.stringify({
      snapshotId,
      calculationId: input.calculationId,
      calculationProfileId: input.calculationProfileId,
      currencyContextId: input.currencyContextId,
      originalMoneyValues: input.originalMoneyValues,
      exchangeRateSnapshots: input.exchangeRateSnapshots,
      valuationSnapshots: input.valuationSnapshots,
      convertedMoneyValues: input.convertedMoneyValues,
      religiousValues: input.religiousValues,
      roundingPolicies: input.roundingPolicies,
      reconciliation: input.reconciliation,
      knowledgeReleaseVersion,
      ruleEngineVersion,
    });

    const snapshotChecksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    const snapshot: MonetaryCalculationSnapshot = {
      snapshotId,
      calculationId: input.calculationId,
      calculationProfileId: input.calculationProfileId,
      currencyContextId: input.currencyContextId,
      originalMoneyValues: input.originalMoneyValues,
      exchangeRateSnapshots: input.exchangeRateSnapshots,
      valuationSnapshots: input.valuationSnapshots,
      convertedMoneyValues: input.convertedMoneyValues,
      religiousValues: input.religiousValues,
      roundingPolicies: input.roundingPolicies,
      reconciliation: input.reconciliation,
      knowledgeReleaseVersion,
      ruleEngineVersion,
      snapshotChecksum,
      createdAt,
      isImmutable: true,
    };

    this.snapshotStore.set(snapshotId, snapshot);
    return snapshot;
  }

  public static getSnapshot(snapshotId: string): MonetaryCalculationSnapshot | null {
    return this.snapshotStore.get(snapshotId) || null;
  }

  public static verifyIntegrity(snapshot: MonetaryCalculationSnapshot): boolean {
    const checksumPayload = JSON.stringify({
      snapshotId: snapshot.snapshotId,
      calculationId: snapshot.calculationId,
      calculationProfileId: snapshot.calculationProfileId,
      currencyContextId: snapshot.currencyContextId,
      originalMoneyValues: snapshot.originalMoneyValues,
      exchangeRateSnapshots: snapshot.exchangeRateSnapshots,
      valuationSnapshots: snapshot.valuationSnapshots,
      convertedMoneyValues: snapshot.convertedMoneyValues,
      religiousValues: snapshot.religiousValues,
      roundingPolicies: snapshot.roundingPolicies,
      reconciliation: snapshot.reconciliation,
      knowledgeReleaseVersion: snapshot.knowledgeReleaseVersion,
      ruleEngineVersion: snapshot.ruleEngineVersion,
    });

    const computed = crypto.createHash('sha256').update(checksumPayload).digest('hex');
    return computed === snapshot.snapshotChecksum;
  }
}
