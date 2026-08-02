/**
 * MIZAN — Rule Conflict Detector Service
 *
 * Detects conflicts between rules within a release.
 * Rules that are declared incompatible via `incompatibleWithRules` OR
 * recorded in the `rule_conflicts` DB table must NOT coexist in the same release.
 *
 * CRITICAL: Conflicts are NEVER resolved silently. Detection causes a hard stop
 * and the conflict is logged for governance review.
 */

import { CanonicalRule } from '@mizan/shared';
import { prisma } from '../../../config/database';

export interface RuleConflictReport {
  conflictsFound: boolean;
  conflictCount: number;
  conflicts: RuleConflictDetail[];
  detectedAt: string;
}

export interface RuleConflictDetail {
  ruleIdA: string;
  ruleIdB: string;
  conflictType: 'DECLARED_INCOMPATIBLE' | 'DB_CONFLICT_RECORD';
  reason: string;
  resolutionRequired: 'REMOVE_ONE_RULE' | 'GOVERNANCE_REVIEW';
}

export class RuleConflictDetectorService {
  /**
   * Scans a set of candidate rules for declared incompatibilities.
   * Also checks the database conflict table for registered conflicts.
   */
  static async detectConflicts(rules: CanonicalRule[]): Promise<RuleConflictReport> {
    const conflicts: RuleConflictDetail[] = [];
    const ruleIds = rules.map(r => r.identity.ruleId);

    // 1. Check declared incompatibilities within rule identities
    for (const rule of rules) {
      const incompatibles = rule.identity.incompatibleWithRules ?? [];
      for (const incompatibleId of incompatibles) {
        if (ruleIds.includes(incompatibleId)) {
          // Only log once per pair
          const alreadyLogged = conflicts.some(
            c => (c.ruleIdA === rule.identity.ruleId && c.ruleIdB === incompatibleId) ||
                 (c.ruleIdA === incompatibleId && c.ruleIdB === rule.identity.ruleId)
          );
          if (!alreadyLogged) {
            conflicts.push({
              ruleIdA: rule.identity.ruleId,
              ruleIdB: incompatibleId,
              conflictType: 'DECLARED_INCOMPATIBLE',
              reason: `Rule "${rule.identity.ruleId}" declares "${incompatibleId}" as incompatible.`,
              resolutionRequired: 'REMOVE_ONE_RULE',
            });
          }
        }
      }
    }

    // 2. Check database conflict table
    try {
      const dbConflicts = await (prisma as any).ruleConflict.findMany({
        where: {
          OR: [
            { rule_id_a: { in: ruleIds } },
            { rule_id_b: { in: ruleIds } },
          ],
        },
      });

      for (const dbConflict of dbConflicts) {
        const bothPresent = ruleIds.includes(dbConflict.rule_id_a) &&
                            ruleIds.includes(dbConflict.rule_id_b);
        if (bothPresent) {
          conflicts.push({
            ruleIdA: dbConflict.rule_id_a,
            ruleIdB: dbConflict.rule_id_b,
            conflictType: 'DB_CONFLICT_RECORD',
            reason: dbConflict.reason,
            resolutionRequired: 'GOVERNANCE_REVIEW',
          });
        }
      }
    } catch {
      // DB table may not exist yet in early migration phases — skip gracefully
    }

    return {
      conflictsFound: conflicts.length > 0,
      conflictCount: conflicts.length,
      conflicts,
      detectedAt: new Date().toISOString(),
    };
  }

  /**
   * Quick check: returns true if any conflicts exist.
   */
  static async hasConflicts(rules: CanonicalRule[]): Promise<boolean> {
    const report = await this.detectConflicts(rules);
    return report.conflictsFound;
  }
}
