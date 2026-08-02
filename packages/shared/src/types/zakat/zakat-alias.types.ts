/**
 * MIZAN — Zakat Category Alias & Normalization Types (Phase 8)
 *
 * Maps alternative user-entered terms, legacy keys, and transliterations
 * to permanent canonical Zakat category IDs.
 *
 * CRITICAL: Aliases are for INPUT NORMALIZATION only.
 * Aliases must never be used as canonical identifiers in rules or reports.
 */

import type { CanonicalZakatCategoryId } from './canonical-zakat-category.types';

/** The type of alias relationship */
export type ZakatAliasType =
  | 'COMMON_TERM'           // Common English term users might enter (e.g. "cash")
  | 'SCHOLARLY_TERM'        // Scholarly or fiqh Arabic term (e.g. "mal al-tijarah")
  | 'LEGACY_TERM'           // Historical or deprecated MIZAN UI label
  | 'TRANSLITERATION'       // Arabic-to-Latin transliteration
  | 'SPELLING_VARIANT'      // Regional spelling variation
  | 'LEGACY_CAMELCASE_KEY'; // Legacy camelCase key from old AssetType enum

/** How the alias string is matched against user input */
export type ZakatAliasMatchingMode =
  | 'EXACT'             // Case-sensitive exact string match
  | 'NORMALIZED_EXACT'; // Case-insensitive after whitespace normalization

/** A single alias record mapping a term to a canonical category ID */
export interface ZakatCategoryAliasRecord {
  /** The alias string to match against */
  aliasText: string;
  /** The canonical category this alias resolves to */
  targetCategoryId: CanonicalZakatCategoryId;
  aliasType: ZakatAliasType;
  matchingMode: ZakatAliasMatchingMode;
  /** Language code the alias applies in (undefined = language-agnostic) */
  languageCode?: string;
  /** Whether this alias is still in active use or has been deprecated */
  isDeprecated: boolean;
  /** Migration note for deprecated aliases */
  migrationNote?: string;
}

// ─── Normalization Result ─────────────────────────────────────────────────────

/** Status of a normalization attempt */
export type ZakatNormalizationStatus =
  | 'RESOLVED'         // Input was unambiguously resolved to a canonical ID
  | 'AMBIGUOUS'        // Input matched multiple candidate categories
  | 'UNSUPPORTED'      // No matching canonical category found
  | 'REVIEW_REQUIRED'; // Matched a REVIEW_REQUIRED category

/** Result of normalizing a user-entered Zakat category input */
export interface ZakatCategoryNormalizationResult {
  inputText: string;
  status: ZakatNormalizationStatus;
  /** Resolved canonical ID when status is RESOLVED */
  resolvedCategoryId?: CanonicalZakatCategoryId;
  /** Candidate IDs when status is AMBIGUOUS */
  candidateCategoryIds?: CanonicalZakatCategoryId[];
  /** Alias record that was matched */
  matchedAlias?: ZakatCategoryAliasRecord;
  /** Explanation for the normalization result */
  explanation?: string;
}
