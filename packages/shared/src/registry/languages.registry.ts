/**
 * Language and Locale Registries
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { LanguageRecord, LocaleRecord } from '../types/explanation/language-registry.types';

export const BASELINE_LANGUAGE_REGISTRY: Record<string, LanguageRecord> = {
  en: {
    languageTag: 'en',
    version: '1.0.0',
    names: {
      en: 'English',
      ha: 'Turanci',
      ar: 'الإنجليزية',
    },
    defaultLocale: 'en-NG',
    direction: 'LTR',
    status: 'ACTIVE',
    fallbackLanguageTag: 'en',
    requiredTranslationCoverage: {
      interface: true,
      calculationExplanations: true,
      evidenceTranslations: false,
      reports: true,
    },
    governance: {
      status: 'PRODUCTION',
    },
  },
  ar: {
    languageTag: 'ar',
    version: '1.0.0',
    names: {
      en: 'Arabic',
      ha: 'Larabci',
      ar: 'العربية',
    },
    defaultLocale: 'ar-SA',
    direction: 'RTL',
    status: 'ACTIVE',
    fallbackLanguageTag: 'en',
    requiredTranslationCoverage: {
      interface: true,
      calculationExplanations: true,
      evidenceTranslations: true,
      reports: true,
    },
    governance: {
      status: 'PRODUCTION',
    },
  },
  ha: {
    languageTag: 'ha',
    version: '1.0.0',
    names: {
      en: 'Hausa',
      ha: 'Hausa',
      ar: 'الهوساوية',
    },
    defaultLocale: 'ha-NG',
    direction: 'LTR',
    status: 'ACTIVE',
    fallbackLanguageTag: 'en',
    requiredTranslationCoverage: {
      interface: true,
      calculationExplanations: true,
      evidenceTranslations: false,
      reports: true,
    },
    governance: {
      status: 'PRODUCTION',
    },
  },
};

export const BASELINE_LOCALE_REGISTRY: Record<string, LocaleRecord> = {
  'en-NG': {
    locale: 'en-NG',
    languageTag: 'en',
    countryCode: 'NG',
    displayName: 'English (Nigeria)',
    dateFormat: 'DD/MM/YYYY',
    numberGroupingSeparator: ',',
    decimalSeparator: '.',
    defaultCurrency: 'NGN',
  },
  'en-GB': {
    locale: 'en-GB',
    languageTag: 'en',
    countryCode: 'GB',
    displayName: 'English (UK)',
    dateFormat: 'DD/MM/YYYY',
    numberGroupingSeparator: ',',
    decimalSeparator: '.',
    defaultCurrency: 'GBP',
  },
  'en-US': {
    locale: 'en-US',
    languageTag: 'en',
    countryCode: 'US',
    displayName: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    numberGroupingSeparator: ',',
    decimalSeparator: '.',
    defaultCurrency: 'USD',
  },
  'ar-SA': {
    locale: 'ar-SA',
    languageTag: 'ar',
    countryCode: 'SA',
    displayName: 'العربية (المملكة العربية السعودية)',
    dateFormat: 'YYYY/MM/DD',
    numberGroupingSeparator: ',',
    decimalSeparator: '.',
    defaultCurrency: 'SAR',
  },
  'ha-NG': {
    locale: 'ha-NG',
    languageTag: 'ha',
    countryCode: 'NG',
    displayName: 'Hausa (Najeriya)',
    dateFormat: 'DD/MM/YYYY',
    numberGroupingSeparator: ',',
    decimalSeparator: '.',
    defaultCurrency: 'NGN',
  },
};
