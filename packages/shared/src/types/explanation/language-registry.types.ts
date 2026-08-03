import { TextDirection } from '../profile.types';

export type SupportedLanguageTag = 'en' | 'ar' | 'ha' | 'fr' | 'sw' | 'yo' | 'ig';

export type { TextDirection };


export interface RequiredTranslationCoverage {
  interface: boolean;
  calculationExplanations: boolean;
  evidenceTranslations: boolean;
  reports: boolean;
}

export interface LanguageRecord {
  languageTag: SupportedLanguageTag;
  version: string;
  names: Record<string, string>; // e.g. { en: 'Hausa', ha: 'Hausa', ar: 'الهوساوية' }
  defaultLocale: string;
  direction: TextDirection;
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED';
  fallbackLanguageTag: SupportedLanguageTag;
  requiredTranslationCoverage: RequiredTranslationCoverage;
  governance: {
    status: 'PRODUCTION' | 'DRAFT';
  };
}

export interface LocaleRecord {
  locale: string;
  languageTag: SupportedLanguageTag;
  countryCode: string;
  displayName: string;
  dateFormat: string;
  numberGroupingSeparator: string;
  decimalSeparator: string;
  defaultCurrency: string;
}

export interface LanguageFallbackPolicy {
  policyId: string;
  primaryLanguageTag: SupportedLanguageTag;
  fallbackChain: SupportedLanguageTag[];
  allowMachineTranslationFallback: boolean; // MUST be false
}
