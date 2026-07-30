import { useSettingsStore } from '../stores/settings.store';
import { translations, Translations, SupportedLanguage } from './translations';

export interface UseTranslationReturn {
  t: (key: keyof Translations) => string;
  language: SupportedLanguage;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  textAlign: 'right' | 'left';
}

export const useTranslation = (): UseTranslationReturn => {
  const lang = useSettingsStore((s) => s.language);
  const normalizedLang: SupportedLanguage = (lang === 'ar' || lang === 'ha') ? lang : 'en';

  const isRTL = normalizedLang === 'ar';
  const dict = translations[normalizedLang] || translations.en;

  const t = (key: keyof Translations): string => {
    return dict[key] || translations.en[key] || String(key);
  };

  return {
    t,
    language: normalizedLang,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
  };
};

/**
 * Static translation helper for non-React context or direct utility calls.
 */
export const getTranslation = (key: keyof Translations, langOverride?: string): string => {
  const lang = langOverride || useSettingsStore.getState().language;
  const normalized: SupportedLanguage = (lang === 'ar' || lang === 'ha') ? (lang as SupportedLanguage) : 'en';
  const dict = translations[normalized] || translations.en;
  return dict[key] || translations.en[key] || String(key);
};
