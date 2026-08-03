/**
 * MIZAN — Zakat Result Assembler Service (Phase 13)
 * Assembles ZakatModuleResult and category ResultItems from Zakat calculation output.
 */

import type { ZakatModuleResult, ResultItem, MoneyValue } from '@mizan/shared';
import { ResultItemFactoryService } from './result-item-factory.service';

export interface ZakatAssemblerInput {
  zakatResult: any;
  currencyCode: string;
  calculationId: string;
}

export class ZakatResultAssemblerService {
  static assembleZakatResult(input: ZakatAssemblerInput): {
    moduleResult: ZakatModuleResult;
    resultItems: ResultItem[];
  } {
    const { zakatResult, currencyCode, calculationId } = input;
    const resultItems: ResultItem[] = [];

    const nisabThreshold = zakatResult.nisabThreshold ?? 0;
    const netZakatableWealth = zakatResult.netZakatableWealth ?? zakatResult.netAssets ?? 0;
    const zakatDue = zakatResult.zakatDue ?? zakatResult.zakatPayable ?? 0;
    const isDue = zakatDue > 0 || zakatResult.isEligible === true;
    const hawlMet = zakatResult.hawlMet ?? true;

    const nisabMinor = (nisabThreshold * 100).toFixed(0);
    const netMinor = (netZakatableWealth * 100).toFixed(0);
    const zakatDueMinor = (zakatDue * 100).toFixed(0);

    const nisabMoney: MoneyValue = {
      currencyCode,
      representationType: 'MINOR_UNITS',
      amountMinor: nisabMinor,
      decimalAmount: Number(nisabThreshold).toFixed(2),
      minorUnitDigits: 2,
    };

    const nisabItem = ResultItemFactoryService.createResultItem({
      itemType: 'ZAKAT_NISAB_RESULT',
      subject: {
        subjectType: 'CALCULATION',
        subjectId: 'SILVER_NISAB_THRESHOLD',
        subjectVersion: '1.0.0',
        instanceId: `nisab_${calculationId}`,
      },
      status: netZakatableWealth >= nisabThreshold ? 'ELIGIBLE' : 'BELOW_NISAB',
      decisionCode: netZakatableWealth >= nisabThreshold ? 'ZAKAT_NISAB_REACHED' : 'ZAKAT_NISAB_NOT_REACHED',
      decisionType: 'NISAB_EVALUATION',
      authoritativePayload: {
        nisabMethod: 'SILVER',
        thresholdReferenceGrams: 595,
        comparisonBaseMinor: netMinor,
        nisabThresholdMinor: nisabMinor,
        status: netZakatableWealth >= nisabThreshold ? 'REACHED' : 'NOT_REACHED',
      },
      monetaryValues: [
        {
          valueId: 'NISAB_THRESHOLD',
          role: 'CALCULATION_BASE',
          money: nisabMoney,
        },
      ],
      displayOrder: 10,
      sectionCode: 'NISAB_SUMMARY',
    });
    resultItems.push(nisabItem);

    // 2. Monetary Category Results
    const categoryItemIds: string[] = [];
    const breakdown: Array<{ name: string; value: number; isZakatable?: boolean }> = zakatResult.breakdown ?? [
      { name: 'CASH', value: netZakatableWealth, isZakatable: true },
    ];

    breakdown.forEach((item: any, idx: number) => {
      if (item.isZakatable === false || item.value <= 0) return;
      const itemMinor = (item.value * 100).toFixed(0);
      const catObligationMinor = isDue ? ((item.value * 0.025) * 100).toFixed(0) : '0';

      const catItem = ResultItemFactoryService.createResultItem({
        itemType: 'ZAKAT_CATEGORY_RESULT',
        subject: {
          subjectType: 'ZAKAT_CATEGORY',
          subjectId: item.name.toUpperCase().replace(/\s+/g, '_'),
          subjectVersion: '1.0.0',
          instanceId: `zakat_cat_${idx + 1}`,
        },
        status: isDue ? 'OBLIGATION_DUE' : 'NOT_DUE',
        decisionCode: 'ZAKAT_MONETARY_OBLIGATION_DUE',
        decisionType: 'MONETARY_ZAKAT_OBLIGATION',
        authoritativePayload: {
          eligibilityStatus: 'ELIGIBLE',
          nisabStatus: netZakatableWealth >= nisabThreshold ? 'REACHED' : 'NOT_REACHED',
          holdingPeriodStatus: hawlMet ? 'SATISFIED' : 'NOT_SATISFIED',
          obligationType: 'MONETARY_AMOUNT',
        },
        exactValues: {
          rates: [
            {
              valueId: 'ZAKAT_RATE',
              representation: 'RATIONAL',
              numerator: 1,
              denominator: 40,
            },
          ],
        },
        monetaryValues: [
          {
            valueId: 'ZAKAT_BASE',
            role: 'CALCULATION_BASE',
            money: {
              currencyCode,
              representationType: 'MINOR_UNITS',
              amountMinor: itemMinor,
              decimalAmount: Number(item.value).toFixed(2),
              minorUnitDigits: 2,
            },
          },
          {
            valueId: 'FINAL_OBLIGATION',
            role: 'FINAL_RESULT',
            money: {
              currencyCode,
              representationType: 'MINOR_UNITS',
              amountMinor: catObligationMinor,
              decimalAmount: (Number(catObligationMinor) / 100).toFixed(2),
              minorUnitDigits: 2,
            },
          },
        ],
        displayOrder: 20 + idx,
        sectionCode: 'ZAKAT_CATEGORIES',
      });

      resultItems.push(catItem);
      categoryItemIds.push(catItem.resultItemId);
    });

    const totalMoney: MoneyValue = {
      currencyCode,
      representationType: 'MINOR_UNITS',
      amountMinor: zakatDueMinor,
      decimalAmount: Number(zakatDue).toFixed(2),
      minorUnitDigits: 2,
    };

    const moduleResult: ZakatModuleResult = {
      module: 'ZAKAT',
      assets: {
        entered: breakdown.map((b: any) => b.name),
        normalized: breakdown.filter((b: any) => b.isZakatable !== false).map((b: any) => b.name),
        excluded: breakdown.filter((b: any) => b.isZakatable === false).map((b: any) => b.name),
        reviewRequired: [],
      },
      categories: {
        categoryResults: categoryItemIds,
      },
      aggregation: {
        aggregationGroups: ['CASH_AND_EQUIVALENTS'],
        appliedRules: ['RULE-ZAKAT-AGGREGATION-001'],
      },
      nisab: {
        nisabResults: [nisabItem.resultItemId],
      },
      obligations: {
        monetaryObligations: categoryItemIds,
        physicalObligations: [],
        livestockObligations: [],
        agricultureObligations: [],
        reviewRequiredObligations: [],
      },
      totals: {
        monetaryTotalsByCurrency: [totalMoney],
        physicalObligationCount: 0,
        livestockObligationCount: 0,
      },
      snapshots: {
        zakatResolutionSnapshotId: `snapshot_zakat_${calculationId}`,
        monetaryCalculationSnapshotId: `snapshot_money_${calculationId}`,
      },
    };

    return { moduleResult, resultItems };
  }
}
