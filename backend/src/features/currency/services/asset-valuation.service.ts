/**
 * Asset Valuation Service
 * Phase 12 — MIZAN Currency Architecture
 */

import crypto from 'crypto';
import { AssetValuationSnapshot, MadhhabCode, MoneyValue } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

export class AssetValuationService {
  public static createValuationSnapshot(input: {
    assetInstanceId: string;
    categoryId: string;
    valuationMethodRuleId: string;
    totalValue: MoneyValue;
    quantity?: { value: string; unitId: string };
    unitPrice?: MoneyValue;
    valuationDate: string;
    sourceId: string;
    sourceType: 'MARKET_PROVIDER' | 'DOCUMENTED_APPRAISAL' | 'USER_DECLARED_VALUE' | 'MANUAL_APPROVED_SOURCE';
    selectedMadhhab: MadhhabCode;
    knowledgeReleaseVersion?: string;
  }): AssetValuationSnapshot {
    const valuationSnapshotId = `VAL-SNAP-${crypto.randomUUID()}`;
    const knowledgeReleaseVersion = input.knowledgeReleaseVersion || '2.0.0';

    const checksumPayload = JSON.stringify({
      valuationSnapshotId,
      assetInstanceId: input.assetInstanceId,
      categoryId: input.categoryId,
      valuationMethodRuleId: input.valuationMethodRuleId,
      totalValueAmountMinor: input.totalValue.amountMinor,
      totalValueCurrency: input.totalValue.currencyCode,
      valuationDate: input.valuationDate,
      sourceId: input.sourceId,
      selectedMadhhab: input.selectedMadhhab,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    return {
      valuationSnapshotId,
      assetInstanceId: input.assetInstanceId,
      categoryId: input.categoryId,
      valuationMethodRuleId: input.valuationMethodRuleId,
      valuationMethodRuleVersion: '1.0.0',
      quantity: input.quantity || null,
      unitPrice: input.unitPrice || null,
      totalValue: input.totalValue,
      valuationDate: input.valuationDate,
      valuationSource: {
        sourceId: input.sourceId,
        sourceType: input.sourceType,
      },
      selectedMadhhab: input.selectedMadhhab,
      knowledgeReleaseVersion,
      checksum,
      isImmutable: true,
    };
  }
}
