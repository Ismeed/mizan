/**
 * Language Fallback Policies Registry
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { LanguageFallbackPolicy } from '../types/explanation/language-registry.types';

export const LANGUAGE_FALLBACK_POLICIES: Record<string, LanguageFallbackPolicy> = {
  HAUSA_FALLBACK: {
    policyId: 'HAUSA_FALLBACK',
    primaryLanguageTag: 'ha',
    fallbackChain: ['ha', 'en'],
    allowMachineTranslationFallback: false,
  },
  ARABIC_FALLBACK: {
    policyId: 'ARABIC_FALLBACK',
    primaryLanguageTag: 'ar',
    fallbackChain: ['ar', 'en'],
    allowMachineTranslationFallback: false,
  },
  ENGLISH_FALLBACK: {
    policyId: 'ENGLISH_FALLBACK',
    primaryLanguageTag: 'en',
    fallbackChain: ['en'],
    allowMachineTranslationFallback: false,
  },
};
