/**
 * MIZAN — Hijab Rule Registry Service (Phase 6)
 *
 * Loads, indexes, and retrieves canonical HijabRuleRecord instances from
 * the database. Provides madhhab-scoped rule lookup for the resolver.
 *
 * CRITICAL: Only rules with governance_status = PRODUCTION are available
 *           for live calculations. DRAFT/TEST rules are available in
 *           test environments only.
 */

import { prisma } from '../../../config/database';
import type {
  HijabRuleRecord,
  HijabEvidenceRef,
  HijabExplanationRef,
  HijabRuleGovernance,
  HijabRuleVersioning,
  HijabEffectType,
  HijabCategoryType,
} from '@mizan/shared';
import type { RuleMadhhabScope } from '@mizan/shared';

type HijabRuleDbRow = {
  id: string;
  hijab_rule_id: string;
  hijab_rule_version: string;
  title_en: string;
  title_ar: string | null;
  description_en: string;
  category: string;
  blocked_heir_key: string;
  blocking_cause: string;
  effect_type: string;
  reduced_fraction_json: unknown;
  madhhab_scope_json: unknown;
  evidence_refs_json: unknown;
  explanation_refs_json: unknown;
  governance_status: string;
  is_test_fixture: boolean;
  fixture_tag: string | null;
  schema_version: string;
  created_by: string;
  updated_by: string;
  review_notes: string | null;
  requires_scholar_countersign: boolean;
  content_checksum: string;
  supersedes: string | null;
  effective_from: Date | null;
  effective_until: Date | null;
  changelog_note: string | null;
  created_at: Date;
  updated_at: Date;
};

function mapDbRowToRecord(row: HijabRuleDbRow): HijabRuleRecord {
  const governance: HijabRuleGovernance = {
    status: row.governance_status as HijabRuleGovernance['status'],
    isTestFixture: row.is_test_fixture,
    fixtureTag: row.fixture_tag === 'TEST_ONLY_FIXTURE' ? 'TEST_ONLY_FIXTURE' : undefined,
    schemaVersion: row.schema_version,
    createdBy: row.created_by,
    createdAt: row.created_at.toISOString(),
    updatedBy: row.updated_by,
    updatedAt: row.updated_at.toISOString(),
    reviewNotes: row.review_notes ?? undefined,
    requiresScholarCounterSignPerExecution: row.requires_scholar_countersign,
  };

  const versioning: HijabRuleVersioning = {
    contentChecksum: row.content_checksum,
    supersedes: row.supersedes ?? undefined,
    effectiveFrom: row.effective_from?.toISOString(),
    effectiveUntil: row.effective_until?.toISOString(),
    changelogNote: row.changelog_note ?? undefined,
  };

  return {
    hijabRuleId: row.hijab_rule_id,
    hijabRuleVersion: row.hijab_rule_version,
    titleEn: row.title_en,
    titleAr: row.title_ar ?? undefined,
    descriptionEn: row.description_en,
    category: row.category as HijabCategoryType,
    blockedHeirKey: row.blocked_heir_key,
    blockingCause: row.blocking_cause,
    effectType: row.effect_type as HijabEffectType,
    reducedFraction: row.reduced_fraction_json as { numerator: number; denominator: number } | undefined,
    madhhabScope: row.madhhab_scope_json as RuleMadhhabScope[],
    evidenceRefs: (row.evidence_refs_json as HijabEvidenceRef[]) ?? [],
    explanationRefs: (row.explanation_refs_json as HijabExplanationRef[]) ?? [],
    governance,
    versioning,
  };
}

export class HijabRuleRegistryService {
  /**
   * Loads all PRODUCTION hijab rules applicable for a given madhhab.
   * Includes rules scoped to ALL_SCHOOLS and ALL_SUNNI for Sunni madhhabs.
   */
  static async loadRulesForMadhhab(
    madhhab: string,
    allowTestFixtures = false
  ): Promise<HijabRuleRecord[]> {
    const governanceStatuses = allowTestFixtures
      ? ['PRODUCTION', 'APPROVED', 'DRAFT']
      : ['PRODUCTION'];

    const rows = await (prisma as any).hijabRule.findMany({
      where: {
        governance_status: { in: governanceStatuses },
      },
    }) as HijabRuleDbRow[];

    // Filter by madhhab scope in application layer (JSON field)
    const filtered = rows.filter((row) => {
      const scope = row.madhhab_scope_json as string[];
      return (
        scope.includes(madhhab) ||
        scope.includes('ALL_SCHOOLS') ||
        (['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'].includes(madhhab) && scope.includes('ALL_SUNNI'))
      );
    });

    return filtered.map(mapDbRowToRecord);
  }

  /**
   * Loads a single HijabRule by its permanent ID and version.
   */
  static async loadByIdAndVersion(
    hijabRuleId: string,
    hijabRuleVersion: string
  ): Promise<HijabRuleRecord | null> {
    const row = await (prisma as any).hijabRule.findFirst({
      where: {
        hijab_rule_id: hijabRuleId,
        hijab_rule_version: hijabRuleVersion,
      },
    }) as HijabRuleDbRow | null;

    return row ? mapDbRowToRecord(row) : null;
  }

  /**
   * Loads all rules that block a specific heir key.
   */
  static async loadByBlockedHeirKey(
    blockedHeirKey: string,
    madhhab: string,
    allowTestFixtures = false
  ): Promise<HijabRuleRecord[]> {
    const governanceStatuses = allowTestFixtures
      ? ['PRODUCTION', 'APPROVED', 'DRAFT']
      : ['PRODUCTION'];

    const rows = await (prisma as any).hijabRule.findMany({
      where: {
        blocked_heir_key: blockedHeirKey,
        governance_status: { in: governanceStatuses },
      },
    }) as HijabRuleDbRow[];

    const filtered = rows.filter((row) => {
      const scope = row.madhhab_scope_json as string[];
      return (
        scope.includes(madhhab) ||
        scope.includes('ALL_SCHOOLS') ||
        (['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'].includes(madhhab) && scope.includes('ALL_SUNNI'))
      );
    });

    return filtered.map(mapDbRowToRecord);
  }

  /**
   * Returns a list of all unique heir keys that have at least one registered
   * hijab rule in PRODUCTION status for the given madhhab.
   */
  static async getBlockableHeirKeys(madhhab: string): Promise<string[]> {
    const rules = await HijabRuleRegistryService.loadRulesForMadhhab(madhhab);
    const keys = new Set(rules.map((r) => r.blockedHeirKey));
    return Array.from(keys);
  }
}
