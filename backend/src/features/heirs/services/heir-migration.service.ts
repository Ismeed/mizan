/**
 * MIZAN — Heir Migration Service (Phase 7)
 *
 * Scans legacy string inputs, camelCase keys, and screen labels
 * and converts them to permanent Canonical Heir IDs.
 */

import { BASELINE_HEIR_ALIASES, CanonicalHeirId } from '@mizan/shared';

export interface MigrationMapEntry {
  legacyValue: string;
  canonicalHeirId?: CanonicalHeirId;
  migrationStatus: 'VERIFIED' | 'REVIEW_REQUIRED' | 'UNRESOLVED';
  note?: string;
}

export interface LegacyMigrationReport {
  totalProcessed: number;
  verifiedCount: number;
  reviewRequiredCount: number;
  unresolvedCount: number;
  entries: MigrationMapEntry[];
}

export class HeirMigrationService {
  /**
   * Maps a single legacy string value to a canonical heir entry.
   */
  static migrateValue(legacyValue: string): MigrationMapEntry {
    const alias = BASELINE_HEIR_ALIASES.find(
      (a) => a.aliasText.toLowerCase() === legacyValue.trim().toLowerCase()
    );

    if (!alias) {
      return {
        legacyValue,
        migrationStatus: 'UNRESOLVED',
        note: `No alias mapping found for "${legacyValue}".`,
      };
    }

    if (alias.requiresUserConfirmation || alias.aliasType === 'LEGACY_TERM') {
      return {
        legacyValue,
        canonicalHeirId: alias.heirId,
        migrationStatus: 'REVIEW_REQUIRED',
        note: `Alias is ambiguous or legacy — manual review required.`,
      };
    }

    return {
      legacyValue,
      canonicalHeirId: alias.heirId,
      migrationStatus: 'VERIFIED',
    };
  }

  /**
   * Runs migration mapping across a batch of legacy values.
   */
  static migrateBatch(legacyValues: string[]): LegacyMigrationReport {
    const entries = legacyValues.map(HeirMigrationService.migrateValue);
    return {
      totalProcessed: entries.length,
      verifiedCount: entries.filter((e) => e.migrationStatus === 'VERIFIED').length,
      reviewRequiredCount: entries.filter((e) => e.migrationStatus === 'REVIEW_REQUIRED').length,
      unresolvedCount: entries.filter((e) => e.migrationStatus === 'UNRESOLVED').length,
      entries,
    };
  }
}
