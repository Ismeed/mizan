/**
 * Currency Registry Service
 * Phase 12 — MIZAN Currency Architecture
 */

import {
  BASELINE_CURRENCY_REGISTRY,
  CurrencyDefinition,
  CurrencyDefinitionSchema,
} from '@mizan/shared';

export class CurrencyRegistryService {
  private static registryStore: Map<string, CurrencyDefinition> = new Map();

  static {
    // Populate baseline registry
    for (const currency of BASELINE_CURRENCY_REGISTRY) {
      this.registryStore.set(currency.currencyCode, currency);
    }
  }

  public static getCurrency(currencyCode: string): CurrencyDefinition | null {
    const code = currencyCode.toUpperCase();
    return this.registryStore.get(code) || null;
  }

  public static getSupportedCurrencies(options?: {
    countryCode?: string;
    languageTag?: string;
    usageType?: string;
  }): CurrencyDefinition[] {
    let list = Array.from(this.registryStore.values()).filter(
      (c) => c.governance.status === 'APPROVED' || c.governance.status === 'PRODUCTION'
    );

    if (options?.countryCode) {
      const countryUpper = options.countryCode.toUpperCase();
      list = list.filter((c) =>
        c.regionalMetadata.primaryCountryCodes.includes(countryUpper)
      );
    }

    return list;
  }

  public static validateCurrencyForCalculation(
    currencyCode: string,
    module: 'MIRATH' | 'ZAKAT'
  ): { isValid: boolean; currency?: CurrencyDefinition; error?: string } {
    const currency = this.getCurrency(currencyCode);

    if (!currency) {
      return {
        isValid: false,
        error: `UNSUPPORTED_CURRENCY: Currency code '${currencyCode}' is not in the canonical registry`,
      };
    }

    if (!currency.support.calculationEnabled) {
      return {
        isValid: false,
        currency,
        error: `CURRENCY_CALCULATION_DISABLED: Currency '${currencyCode}' is not enabled for calculations`,
      };
    }

    if (currency.governance.status === 'DRAFT') {
      return {
        isValid: false,
        currency,
        error: `DRAFT_CURRENCY_PROHIBITED: Currency '${currencyCode}' is in DRAFT status`,
      };
    }

    return { isValid: true, currency };
  }

  public static resolveLocalizedName(
    currencyCode: string,
    languageTag: string,
    plural: boolean = false
  ): string {
    const currency = this.getCurrency(currencyCode);
    if (!currency) return currencyCode;

    const names = currency.names[languageTag] || currency.names['en'];
    if (!names) return currencyCode;

    return plural ? names.plural : names.singular;
  }

  public static resolveSymbol(currencyCode: string): string {
    const currency = this.getCurrency(currencyCode);
    return currency ? currency.symbolMetadata.defaultSymbol : currencyCode;
  }
}
