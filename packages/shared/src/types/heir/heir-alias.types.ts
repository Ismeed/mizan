/**
 * MIZAN — Heir Alias & Normalization Types (Phase 7)
 *
 * Maps alternative user-entered terms, legacy keys, and transliterations
 * to permanent canonical heir IDs.
 */

import type { CanonicalHeirId } from './canonical-heir.types';

export type HeirAliasType =
  | 'COMMON_TERM'
  | 'SCHOLARLY_TERM'
  | 'LEGACY_TERM'
  | 'TRANSLITERATION'
  | 'SPELLING_VARIANT'
  | 'LEGACY_CAMELCASE_KEY';

export type AliasMatchingMode = 'EXACT' | 'NORMALIZED_EXACT';

export interface HeirAliasRecord {
  aliasId: string;
  heirId: CanonicalHeirId;
  languageTag: string;
  aliasText: string;
  aliasType: HeirAliasType;
  matchingMode: AliasMatchingMode;
  /** Whether fuzzy/ambiguous matches require explicit user confirmation */
  requiresUserConfirmation: boolean;
  sourceProvenance?: {
    bookTitle?: string;
    author?: string;
    language?: string;
    notes?: string;
  };
  reviewStatus: 'DRAFT' | 'APPROVED';
}
