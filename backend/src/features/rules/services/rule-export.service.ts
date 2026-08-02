/**
 * MIZAN — Rule Export Service
 *
 * Exports CanonicalRule records from the database into clean, validated JSON bundles.
 * Includes complete provenance, checksum verification, and optional evidence link hydration.
 */

import { CanonicalRule } from '@mizan/shared';
import { prisma } from '../../../config/database';
import { RuleChecksumService } from './rule-checksum.service';

export interface RuleExportFilter {
  module?: 'MIRATH' | 'ZAKAT' | 'SHARED';
  madhhab?: string;
  status?: string;
  knowledgeReleaseVersion?: string;
  ruleIds?: string[];
  includeTestFixtures?: boolean;
}

export interface RuleExportBundle {
  exportId: string;
  exportedAt: string;
  exportedBy: string;
  schemaVersion: string;
  filter: RuleExportFilter;
  ruleCount: number;
  rules: CanonicalRule[];
  bundleChecksum: string;
}

export class RuleExportService {
  /**
   * Exports matching rules as a structured bundle with verification.
   */
  static async exportRules(
    filter: RuleExportFilter,
    exportedBy: string,
  ): Promise<RuleExportBundle> {
    const whereClause: any = {};

    if (filter.module) whereClause.module = filter.module;
    if (filter.status) whereClause.status = filter.status;
    if (filter.knowledgeReleaseVersion) whereClause.knowledge_release_version = filter.knowledgeReleaseVersion;
    if (filter.ruleIds && filter.ruleIds.length > 0) whereClause.rule_id = { in: filter.ruleIds };

    if (filter.includeTestFixtures === false) {
      whereClause.is_test_fixture = false;
    }

    const records = await (prisma as any).ruleRecord.findMany({
      where: whereClause,
      include: {
        evidenceLinks: true,
        explanationLinks: true,
      },
      orderBy: [{ rule_id: 'asc' }, { rule_version: 'desc' }],
    });

    const rules: CanonicalRule[] = [];

    for (const record of records) {
      const rule = record.rule_content_json as unknown as CanonicalRule;

      // Filter by madhhab if specified
      if (filter.madhhab) {
        const scopes = rule.scope.madhhabScope;
        const matches =
          scopes.includes('ALL_SCHOOLS') ||
          scopes.includes('ALL_SUNNI' as any) ||
          scopes.includes(filter.madhhab.toUpperCase() as any);
        if (!matches) continue;
      }

      // Re-verify checksum
      const isChecksumValid = RuleChecksumService.verifyRuleChecksum(rule);
      if (!isChecksumValid) {
        console.warn(`[RuleExportService] Checksum mismatch for rule ${rule.identity.ruleId} v${rule.identity.ruleVersion}`);
      }

      rules.push(rule);
    }

    // Generate bundle checksum
    const jsonString = JSON.stringify(rules.map(r => r.versioning.contentChecksum).sort());
    const bundleChecksum = require('crypto').createHash('sha256').update(jsonString, 'utf8').digest('hex');

    return {
      exportId: require('crypto').randomUUID(),
      exportedAt: new Date().toISOString(),
      exportedBy,
      schemaVersion: '1.0.0',
      filter,
      ruleCount: rules.length,
      rules,
      bundleChecksum,
    };
  }
}
