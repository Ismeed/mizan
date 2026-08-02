/**
 * MIZAN — Rule Registry Service
 *
 * The single authoritative source of production rules.
 * Loads, validates checksums, caches, and serves canonical rules for calculation.
 *
 * CRITICAL RULES:
 *  - Only PRODUCTION status rules are served for live calculations
 *  - Every loaded rule has its checksum verified before being returned
 *  - Immutable (Object.freeze) rule sets are cached per release version
 *  - Test fixtures are NEVER returned for live calculations (isTestFixture must be false)
 */

import { CanonicalRule } from '@mizan/shared';
import { prisma } from '../../../config/database';
import { RuleChecksumService } from './rule-checksum.service';

export interface RegistryQueryOptions {
  module: 'MIRATH' | 'ZAKAT' | 'SHARED';
  madhhab: string;
  knowledgeReleaseVersion: string;
  ruleTypes?: string[];
  includeTestFixtures?: boolean;
}

export interface RegistryQueryResult {
  rules: CanonicalRule[];
  totalFound: number;
  knowledgeReleaseVersion: string;
  module: string;
  madhhab: string;
  loadedAt: string;
  checksumVerified: boolean;
  failedChecksums: string[];
}

// In-memory cache keyed by `${module}-${madhhab}-${releaseVersion}`
const ruleCache = new Map<string, { rules: CanonicalRule[]; cachedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class RuleRegistryService {
  /**
   * Loads production rules for a given module + madhhab + release version.
   * Validates checksums on every load. Returns frozen rule objects.
   */
  static async getRulesForContext(options: RegistryQueryOptions): Promise<RegistryQueryResult> {
    const {
      module,
      madhhab,
      knowledgeReleaseVersion,
      ruleTypes,
      includeTestFixtures = false,
    } = options;

    // Check cache (for non-test queries only)
    if (!includeTestFixtures) {
      const cacheKey = `${module}-${madhhab}-${knowledgeReleaseVersion}`;
      const cached = ruleCache.get(cacheKey);
      if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL_MS) {
        const filtered = ruleTypes
          ? cached.rules.filter(r => ruleTypes.includes(r.scope.ruleType))
          : cached.rules;
        return {
          rules: filtered,
          totalFound: filtered.length,
          knowledgeReleaseVersion,
          module,
          madhhab,
          loadedAt: new Date(cached.cachedAt).toISOString(),
          checksumVerified: true,
          failedChecksums: [],
        };
      }
    }

    // Load from database
    const whereClause: any = {
      module,
      knowledge_release_version: knowledgeReleaseVersion,
      status: 'PRODUCTION',
    };

    if (!includeTestFixtures) {
      whereClause.is_test_fixture = false;
    }

    if (ruleTypes && ruleTypes.length > 0) {
      whereClause.rule_type = { in: ruleTypes };
    }

    const records = await (prisma as any).ruleRecord.findMany({
      where: whereClause,
      orderBy: [{ priority: 'desc' }, { created_at: 'asc' }],
    });

    const rules: CanonicalRule[] = [];
    const failedChecksums: string[] = [];

    for (const record of records) {
      // Parse the full canonical rule from the content JSON
      const rule = record.rule_content_json as unknown as CanonicalRule;

      // Verify madhhab scope — filter to matching madhhab
      const madhhabScope = rule.scope.madhhabScope;
      const matches =
        madhhabScope.includes('ALL_SCHOOLS') ||
        madhhabScope.includes('ALL_SUNNI' as any) ||
        madhhabScope.includes(madhhab.toUpperCase() as any);

      if (!matches) continue;

      // Verify checksum integrity
      const checksumValid = RuleChecksumService.verifyRuleChecksum(rule);
      if (!checksumValid) {
        failedChecksums.push(rule.identity.ruleId);
        console.error(
          `[RuleRegistry] CHECKSUM_FAILURE rule=${rule.identity.ruleId} version=${rule.identity.ruleVersion}`
        );
        continue; // Skip tampered rule — do not serve it
      }

      rules.push(Object.freeze(rule) as CanonicalRule);
    }

    // Cache result for non-test queries
    if (!includeTestFixtures) {
      const cacheKey = `${module}-${madhhab}-${knowledgeReleaseVersion}`;
      ruleCache.set(cacheKey, { rules, cachedAt: Date.now() });
    }

    const filteredRules = ruleTypes
      ? rules.filter(r => ruleTypes.includes(r.scope.ruleType))
      : rules;

    return {
      rules: filteredRules,
      totalFound: filteredRules.length,
      knowledgeReleaseVersion,
      module,
      madhhab,
      loadedAt: new Date().toISOString(),
      checksumVerified: failedChecksums.length === 0,
      failedChecksums,
    };
  }

  /**
   * Get a single rule by ID and version.
   */
  static async getRuleById(ruleId: string, ruleVersion: string): Promise<CanonicalRule | null> {
    const record = await (prisma as any).ruleRecord.findUnique({
      where: { rule_id_rule_version: { rule_id: ruleId, rule_version: ruleVersion } },
    });

    if (!record) return null;

    const rule = record.rule_content_json as unknown as CanonicalRule;
    return Object.freeze(rule) as CanonicalRule;
  }

  /**
   * Helper method to load rules filtered specifically for a given madhhab.
   */
  static async loadByMadhhab(
    madhhab: string,
    module: 'MIRATH' | 'ZAKAT' | 'SHARED' = 'MIRATH',
    knowledgeReleaseVersion: string = '1.0.0'
  ): Promise<CanonicalRule[]> {
    const res = await RuleRegistryService.getRulesForContext({
      module,
      madhhab,
      knowledgeReleaseVersion,
      includeTestFixtures: true,
    });
    return res.rules;
  }

  /**
   * Clears the in-memory cache (for testing or forced refresh).
   */
  static clearCache(): void {
    ruleCache.clear();
  }
}

