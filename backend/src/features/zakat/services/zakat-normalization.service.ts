/**
 * MIZAN — Zakat Category Alias & Normalization Service (Phase 8)
 *
 * Resolves raw user-entered Zakat category text to permanent canonical IDs.
 * Also provides legacy AssetType migration support.
 *
 * CRITICAL:
 * - This service resolves aliases only — it NEVER calls AI for authoritative resolution.
 * - Ambiguous matches produce a list of candidates; the user must confirm.
 * - All resolved IDs are canonical CanonicalZakatCategoryId values.
 */

import {
  ZAKAT_LEGACY_ALIAS_REGISTRY,
  ZAKAT_LEGACY_MIGRATION_STATUS,
  resolveLegacyZakatAlias,
} from '@mizan/shared';
import type {
  CanonicalZakatCategoryId,
  ZakatCategoryNormalizationResult,
  ZakatAssetNormalizationInput,
} from '@mizan/shared';
import { ZakatCategoryRegistryService } from './zakat-category-registry.service';

const registry = new ZakatCategoryRegistryService();

export class ZakatNormalizationService {

  /**
   * Normalize a raw user-entered category input to a canonical ID.
   * Performs:
   * 1. Exact match against the alias registry
   * 2. Normalized (case-insensitive) match
   * 3. Ambiguity detection (multiple matches → AMBIGUOUS)
   * 4. Unknown input → UNSUPPORTED
   */
  normalizeCategoryInput(
    input: ZakatAssetNormalizationInput,
  ): ZakatCategoryNormalizationResult {
    const { rawInput, madhhab } = input;
    const normalized = rawInput.trim().toLowerCase();

    // ── Pass 1: Exact match ─────────────────────────────────────────────────
    const exactMatches = ZAKAT_LEGACY_ALIAS_REGISTRY.filter(
      a => a.aliasText === rawInput && !a.isDeprecated
        && this.isSupportedInMadhhab(a.targetCategoryId, madhhab)
    );

    if (exactMatches.length === 1) {
      return {
        inputText: rawInput,
        status: this.resolveStatus(exactMatches[0].targetCategoryId),
        resolvedCategoryId: exactMatches[0].targetCategoryId,
        matchedAlias: exactMatches[0],
        explanation: `Resolved via exact alias match: "${exactMatches[0].aliasText}"`,
      };
    }

    // ── Pass 2: Normalized exact match ─────────────────────────────────────
    const normalizedMatches = ZAKAT_LEGACY_ALIAS_REGISTRY.filter(
      a => a.aliasText.trim().toLowerCase() === normalized
        && this.isSupportedInMadhhab(a.targetCategoryId, madhhab)
    );

    if (normalizedMatches.length === 1) {
      return {
        inputText: rawInput,
        status: this.resolveStatus(normalizedMatches[0].targetCategoryId),
        resolvedCategoryId: normalizedMatches[0].targetCategoryId,
        matchedAlias: normalizedMatches[0],
        explanation: `Resolved via normalized alias match: "${normalizedMatches[0].aliasText}"`,
      };
    }

    // ── Pass 3: Ambiguous (multiple candidates) ─────────────────────────────
    if (normalizedMatches.length > 1) {
      const candidateIds = [...new Set(normalizedMatches.map(a => a.targetCategoryId))];
      if (candidateIds.length > 1) {
        return {
          inputText: rawInput,
          status: 'AMBIGUOUS',
          candidateCategoryIds: candidateIds,
          explanation: `Input "${rawInput}" matched multiple categories: ${candidateIds.join(', ')}. User must confirm.`,
        };
      }
      // All matches resolve to the same ID
      return {
        inputText: rawInput,
        status: this.resolveStatus(candidateIds[0]),
        resolvedCategoryId: candidateIds[0],
        matchedAlias: normalizedMatches[0],
        explanation: `Resolved via normalized alias match (multiple aliases, same target).`,
      };
    }

    // ── Pass 4: Direct canonical ID input ──────────────────────────────────
    const upperInput = rawInput.trim().toUpperCase().replace(/\s+/g, '_');
    if (registry.isKnownCategoryId(upperInput)) {
      return {
        inputText: rawInput,
        status: this.resolveStatus(upperInput as CanonicalZakatCategoryId),
        resolvedCategoryId: upperInput as CanonicalZakatCategoryId,
        explanation: `Input matched a canonical category ID directly.`,
      };
    }

    // ── Not found ───────────────────────────────────────────────────────────
    return {
      inputText: rawInput,
      status: 'UNSUPPORTED',
      explanation: `No canonical Zakat category found for input: "${rawInput}". Check alias registry or add a new alias.`,
    };
  }

  /**
   * Migrate a legacy AssetType enum value to a canonical category ID.
   * Returns the migration result including status (VERIFIED or REVIEW_REQUIRED).
   */
  migrateLegacyAssetType(legacyValue: string): {
    canonicalId: string | null;
    status: 'VERIFIED' | 'REVIEW_REQUIRED' | 'NOT_FOUND';
    note?: string;
  } {
    const migrationEntry = ZAKAT_LEGACY_MIGRATION_STATUS[legacyValue];
    if (migrationEntry) {
      return {
        canonicalId: migrationEntry.canonicalId,
        status: migrationEntry.status,
        note: migrationEntry.note,
      };
    }

    // Try alias registry fallback
    const alias = resolveLegacyZakatAlias(legacyValue);
    if (alias) {
      return {
        canonicalId: alias.targetCategoryId,
        status: 'REVIEW_REQUIRED',
        note: alias.migrationNote ?? 'Resolved via alias registry; confirm before production migration.',
      };
    }

    return { canonicalId: null, status: 'NOT_FOUND' };
  }

  /**
   * List all aliases for a given canonical category ID.
   */
  listAliasesForCategory(categoryId: CanonicalZakatCategoryId) {
    return ZAKAT_LEGACY_ALIAS_REGISTRY.filter(a => a.targetCategoryId === categoryId);
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private resolveStatus(categoryId: CanonicalZakatCategoryId): ZakatCategoryNormalizationResult['status'] {
    const entity = registry.findCategoryById(categoryId);
    if (!entity) return 'UNSUPPORTED';
    // Check if any madhhab entry requires review
    const allStatuses = Object.values(entity.madhhabMetadata).map(e => (e as any).inputSupportStatus);
    if (allStatuses.every(s => s === 'REVIEW_REQUIRED')) return 'REVIEW_REQUIRED';
    return 'RESOLVED';
  }

  private isSupportedInMadhhab(categoryId: CanonicalZakatCategoryId, madhhab: string): boolean {
    const entity = registry.findCategoryById(categoryId);
    if (!entity) return false;
    const mKey = madhhab as keyof typeof entity.madhhabMetadata;
    const entry = entity.madhhabMetadata[mKey];
    if (!entry) return true; // unknown madhhab — don't filter
    return entry.inputSupportStatus !== 'NOT_SUPPORTED';
  }
}
