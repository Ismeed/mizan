/**
 * Language Registry Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { BASELINE_LANGUAGE_REGISTRY, BASELINE_LOCALE_REGISTRY, LanguageRecord, LocaleRecord, SupportedLanguageTag } from '@mizan/shared';

export class LanguageRegistryService {
  public static getLanguage(tag: string): LanguageRecord | null {
    return BASELINE_LANGUAGE_REGISTRY[tag] || null;
  }

  public static getLocale(localeTag: string): LocaleRecord | null {
    return BASELINE_LOCALE_REGISTRY[localeTag] || null;
  }

  public static isSupportedLanguage(tag: string): tag is SupportedLanguageTag {
    return tag in BASELINE_LANGUAGE_REGISTRY;
  }

  public static getDirection(tag: string): 'LTR' | 'RTL' {
    const lang = this.getLanguage(tag);
    return lang ? lang.direction : 'LTR';
  }
}
