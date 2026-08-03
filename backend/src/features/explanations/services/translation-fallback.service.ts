/**
 * Translation Fallback Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { LANGUAGE_FALLBACK_POLICIES, LanguageFallbackPolicy } from '@mizan/shared';

export interface FallbackResolutionResult {
  resolvedLanguageTag: string;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

export class TranslationFallbackService {
  public static resolveLanguage(
    requestedLanguageTag: string,
    availableLanguages: string[]
  ): FallbackResolutionResult {
    if (availableLanguages.includes(requestedLanguageTag)) {
      return {
        resolvedLanguageTag: requestedLanguageTag,
        fallbackUsed: false,
      };
    }

    const langUpper = requestedLanguageTag.toUpperCase();
    const policyKey = langUpper === 'HA' ? 'HAUSA_FALLBACK' : langUpper === 'AR' ? 'ARABIC_FALLBACK' : `${langUpper}_FALLBACK`;
    const policy: LanguageFallbackPolicy = LANGUAGE_FALLBACK_POLICIES[policyKey] || LANGUAGE_FALLBACK_POLICIES['ENGLISH_FALLBACK'];

    for (const fallbackTag of policy.fallbackChain) {
      if (availableLanguages.includes(fallbackTag)) {
        const langName = requestedLanguageTag === 'ha' ? 'HAUSA' : requestedLanguageTag === 'ar' ? 'ARABIC' : requestedLanguageTag.toUpperCase();
        return {
          resolvedLanguageTag: fallbackTag,
          fallbackUsed: fallbackTag !== requestedLanguageTag,
          fallbackReason: `APPROVED_${langName}_TRANSLATION_UNAVAILABLE`,
        };
      }
    }

    return {
      resolvedLanguageTag: 'en',
      fallbackUsed: true,
      fallbackReason: 'NO_APPROVED_TRANSLATION_AVAILABLE_DEFAULTED_TO_EN',
    };
  }
}
