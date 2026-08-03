/**
 * Nisab Valuation Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Expresses the approved Nisab method threshold monetarily through an approved market price snapshot.
 * Currency expresses the Nisab threshold — it does NOT determine the Nisab rule.
 */

import crypto from 'crypto';
import Decimal from 'decimal.js';
import { MadhhabCode, MoneyValue, NisabValuationSnapshot } from '@mizan/shared';
import { MoneyArithmeticService } from './money-arithmetic.service';

const GOLD_NISAB_GRAMS = '85';
const SILVER_NISAB_GRAMS = '595';

// Default baseline market prices (USD per gram) used when no live snapshot ID is provided
const DEFAULT_GOLD_PRICE_USD = '60.00';
const DEFAULT_SILVER_PRICE_USD = '0.75';

export class NisabValuationService {
  public static computeNisabMonetaryValue(input: {
    referenceAsset: 'GOLD' | 'SILVER';
    currencyCode: string;
    selectedMadhhab: MadhhabCode;
    valuationDate?: string;
    unitPriceOverrideDecimal?: string;
  }): { nisabMoney: MoneyValue; snapshot: NisabValuationSnapshot } {
    const currencyCode = input.currencyCode.toUpperCase();
    const valuationDate = input.valuationDate || new Date().toISOString().split('T')[0];

    const quantityGrams = input.referenceAsset === 'GOLD' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
    const defaultUnitPrice =
      input.referenceAsset === 'GOLD' ? DEFAULT_GOLD_PRICE_USD : DEFAULT_SILVER_PRICE_USD;
    const unitPriceDecimal = input.unitPriceOverrideDecimal || defaultUnitPrice;

    const qtyDec = new Decimal(quantityGrams);
    const unitPriceDec = new Decimal(unitPriceDecimal);
    const totalNisabDecimal = qtyDec.mul(unitPriceDec).toString();

    const nisabMoney = MoneyArithmeticService.createMoney(totalNisabDecimal, currencyCode);

    const nisabSnapshotId = `NISAB-SNAP-${crypto.randomUUID()}`;
    const nisabMethodRuleId = `NISAB-RULE-${input.referenceAsset}-${input.selectedMadhhab}`;

    const checksumPayload = JSON.stringify({
      nisabSnapshotId,
      nisabMethodRuleId,
      referenceAsset: input.referenceAsset,
      quantityGrams,
      nisabAmountMinor: nisabMoney.amountMinor,
      currencyCode,
      valuationDate,
      selectedMadhhab: input.selectedMadhhab,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    const snapshot: NisabValuationSnapshot = {
      nisabValuationSnapshotId: nisabSnapshotId,
      nisabMethodRuleId,
      referenceAssetId: input.referenceAsset,
      referenceQuantity: {
        value: quantityGrams,
        unitId: 'GRAMS',
      },
      unitPriceSnapshotId: `MKT-SNAP-DEFAULT-${input.referenceAsset}`,
      nisabMoneyValue: nisabMoney,
      valuationDate,
      selectedMadhhab: input.selectedMadhhab,
      checksum,
      createdAt: new Date().toISOString(),
    };

    return { nisabMoney, snapshot };
  }
}
