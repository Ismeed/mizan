export interface CurrencyDefinition {
  code: string;
  name: {
    en: string;
    ha: string;
    ar: string;
    fr?: string;
  };
  symbol: string;
  decimalPlaces: number;
  defaultLocale: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const CURRENCY_REGISTRY: Record<string, CurrencyDefinition> = {
  NGN: {
    code: 'NGN',
    name: {
      en: 'Nigerian Naira',
      ha: 'Nairar Najeriya',
      ar: 'النايرا النيجيرية',
    },
    symbol: '₦',
    decimalPlaces: 2,
    defaultLocale: 'en-NG',
    status: 'ACTIVE',
  },
  USD: {
    code: 'USD',
    name: {
      en: 'US Dollar',
      ha: 'Dalar Amurka',
      ar: 'الدولار الأمريكي',
    },
    symbol: '$',
    decimalPlaces: 2,
    defaultLocale: 'en-US',
    status: 'ACTIVE',
  },
  GBP: {
    code: 'GBP',
    name: {
      en: 'British Pound',
      ha: 'Fam din Biritaniya',
      ar: 'الجنيه الإسترليني',
    },
    symbol: '£',
    decimalPlaces: 2,
    defaultLocale: 'en-GB',
    status: 'ACTIVE',
  },
  EUR: {
    code: 'EUR',
    name: {
      en: 'Euro',
      ha: 'Yuro',
      ar: 'اليورو',
    },
    symbol: '€',
    decimalPlaces: 2,
    defaultLocale: 'en-EU',
    status: 'ACTIVE',
  },
  SAR: {
    code: 'SAR',
    name: {
      en: 'Saudi Riyal',
      ha: 'Riyalar Saudiyya',
      ar: 'الريال السعودي',
    },
    symbol: '﷼',
    decimalPlaces: 2,
    defaultLocale: 'ar-SA',
    status: 'ACTIVE',
  },
  AED: {
    code: 'AED',
    name: {
      en: 'UAE Dirham',
      ha: 'Dirham din Emirets',
      ar: 'الدرهم الإماراتي',
    },
    symbol: 'د.إ',
    decimalPlaces: 2,
    defaultLocale: 'ar-AE',
    status: 'ACTIVE',
  },
  GHS: {
    code: 'GHS',
    name: {
      en: 'Ghanaian Cedi',
      ha: 'Sidin Gana',
      ar: 'السيبي الغاني',
    },
    symbol: 'GH₵',
    decimalPlaces: 2,
    defaultLocale: 'en-GH',
    status: 'ACTIVE',
  },
  KES: {
    code: 'KES',
    name: {
      en: 'Kenyan Shilling',
      ha: 'Shillin din Kenya',
      ar: 'الشيلينغ الكيني',
    },
    symbol: 'KSh',
    decimalPlaces: 2,
    defaultLocale: 'sw-KE',
    status: 'ACTIVE',
  },
};

export class CurrencyRegistryService {
  static get(code: string): CurrencyDefinition | undefined {
    const canonical = (code || '').toUpperCase();
    return CURRENCY_REGISTRY[canonical];
  }

  static isSupported(code: string): boolean {
    const def = this.get(code);
    return def !== undefined && def.status === 'ACTIVE';
  }

  static getAll(): CurrencyDefinition[] {
    return Object.values(CURRENCY_REGISTRY);
  }

  static formatAmount(amount: number, code: string, localeOverride?: string): string {
    const def = this.get(code) || CURRENCY_REGISTRY.USD;
    const locale = localeOverride || def.defaultLocale;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: def.code,
        minimumFractionDigits: def.decimalPlaces,
        maximumFractionDigits: def.decimalPlaces,
      }).format(amount);
    } catch {
      return `${def.symbol}${amount.toFixed(def.decimalPlaces)}`;
    }
  }
}
