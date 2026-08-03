/**
 * AI Currency Context Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { AICurrencyContextPackage, Fraction, MoneyValue } from '@mizan/shared';

export class AICurrencyContextService {
  public static buildContextPackage(input: {
    calculationId: string;
    module: 'MIRATH' | 'ZAKAT';
    selectedMadhhab: string;
    languageTag: string;
    shareOrRate: Fraction;
    sourceMoney: MoneyValue;
    targetMoney?: MoneyValue | null;
    calculationCurrencyCode: string;
    exchangeRateSnapshot?: any;
    roundingPolicyId?: string;
    valuationDate?: string;
  }): AICurrencyContextPackage {
    return {
      task: 'EXPLAIN_MONETARY_RESULT',
      calculationContext: {
        calculationId: input.calculationId,
        module: input.module,
        selectedMadhhab: input.selectedMadhhab,
        languageTag: input.languageTag,
        knowledgeReleaseVersion: '2.0.0',
        ruleEngineVersion: '1.0.0',
      },
      religiousContext: {
        shareOrRate: input.shareOrRate,
        appliedRuleIds: [],
        evidenceIds: [],
      },
      currencyContext: {
        sourceMoney: input.sourceMoney,
        targetMoney: input.targetMoney || null,
        calculationCurrencyCode: input.calculationCurrencyCode,
        exchangeRateSnapshot: input.exchangeRateSnapshot || null,
        roundingPolicyId: input.roundingPolicyId || 'MONEY-ROUNDING-STANDARD-001',
        valuationDate: input.valuationDate || new Date().toISOString().split('T')[0],
      },
      restrictions: {
        mustNotChangeReligiousShare: true,
        mustNotChangeZakatRate: true,
        mustNotInventExchangeRate: true,
        mustNotUseCurrentRateForHistoricalResult: true,
        mustNotPresentConversionAsReligiousRuling: true,
        mustNotSwitchCurrencySilently: true,
        mustUseProvidedMonetaryContext: true,
      },
    };
  }
}
