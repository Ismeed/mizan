/**
 * Multi Currency Zakat Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { MoneyValue } from '@mizan/shared';
import { CurrencyConversionService } from './currency-conversion.service';
import { MoneyArithmeticService } from './money-arithmetic.service';

export interface ZakatAssetInput {
  categoryId: string;
  description?: string;
  originalMoney: MoneyValue;
}

export class MultiCurrencyZakatService {
  public static processZakatAssets(input: {
    assets: ZakatAssetInput[];
    calculationCurrencyCode: string;
    valuationDate?: string;
  }): {
    totalZakatableBaseMoney: MoneyValue;
    processedAssets: { categoryId: string; normalizedMoney: MoneyValue; conversionSnapshotId?: string }[];
  } {
    const targetCode = input.calculationCurrencyCode.toUpperCase();
    const processedAssets: { categoryId: string; normalizedMoney: MoneyValue; conversionSnapshotId?: string }[] = [];
    const normalizedMonies: MoneyValue[] = [];

    for (const asset of input.assets) {
      if (asset.originalMoney.currencyCode === targetCode) {
        processedAssets.push({
          categoryId: asset.categoryId,
          normalizedMoney: asset.originalMoney,
        });
        normalizedMonies.push(asset.originalMoney);
      } else {
        const convRes = CurrencyConversionService.convertMoney({
          conversionRequestId: `CONV-ZAK-${asset.categoryId}`,
          sourceMoney: asset.originalMoney,
          targetCurrencyCode: targetCode,
          valuationDate: input.valuationDate || new Date().toISOString().split('T')[0],
          conversionPurpose: 'ZAKAT_ASSET_AGGREGATION',
        });

        processedAssets.push({
          categoryId: asset.categoryId,
          normalizedMoney: convRes.targetMoney,
          conversionSnapshotId: convRes.exchangeRateSnapshotId,
        });
        normalizedMonies.push(convRes.targetMoney);
      }
    }

    const totalZakatableBaseMoney =
      normalizedMonies.length > 0
        ? MoneyArithmeticService.sum(normalizedMonies, targetCode)
        : MoneyArithmeticService.createMoney('0', targetCode);

    return {
      totalZakatableBaseMoney,
      processedAssets,
    };
  }
}
