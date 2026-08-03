/**
 * Multi Currency Estate Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { EstateCurrencyMode, EstateItemInput, MoneyValue } from '@mizan/shared';
import { CurrencyConversionService } from './currency-conversion.service';
import { MoneyArithmeticService } from './money-arithmetic.service';

export class MultiCurrencyEstateService {
  public static processEstateItems(input: {
    items: EstateItemInput[];
    calculationCurrencyCode: string;
    mode: EstateCurrencyMode;
    valuationDate?: string;
  }): {
    consolidatedNetEstateMoney: MoneyValue;
    itemConversions: { estateItemId: string; convertedMoney: MoneyValue; snapshotId?: string }[];
  } {
    const targetCode = input.calculationCurrencyCode.toUpperCase();
    const itemConversions: { estateItemId: string; convertedMoney: MoneyValue; snapshotId?: string }[] = [];
    const convertedMonies: MoneyValue[] = [];

    for (const item of input.items) {
      if (item.originalValue.currencyCode === targetCode) {
        itemConversions.push({
          estateItemId: item.estateItemId,
          convertedMoney: item.originalValue,
        });
        convertedMonies.push(item.originalValue);
      } else {
        if (input.mode === 'PRESERVE_SOURCE_CURRENCIES') {
          itemConversions.push({
            estateItemId: item.estateItemId,
            convertedMoney: item.originalValue,
          });
          // In preserve mode, keep as is
        } else {
          // Consolidate via conversion
          const convRes = CurrencyConversionService.convertMoney({
            conversionRequestId: `CONV-EST-${item.estateItemId}`,
            sourceMoney: item.originalValue,
            targetCurrencyCode: targetCode,
            valuationDate: input.valuationDate || new Date().toISOString().split('T')[0],
            conversionPurpose: 'ESTATE_CONSOLIDATION',
          });

          itemConversions.push({
            estateItemId: item.estateItemId,
            convertedMoney: convRes.targetMoney,
            snapshotId: convRes.exchangeRateSnapshotId,
          });
          convertedMonies.push(convRes.targetMoney);
        }
      }
    }

    const consolidatedNetEstateMoney =
      convertedMonies.length > 0
        ? MoneyArithmeticService.sum(convertedMonies, targetCode)
        : MoneyArithmeticService.createMoney('0', targetCode);

    return {
      consolidatedNetEstateMoney,
      itemConversions,
    };
  }
}
