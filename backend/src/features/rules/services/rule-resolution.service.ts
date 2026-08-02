/**
 * MIZAN — Rule Resolution Service
 *
 * Resolves the winning rule from a set of matched rules within each rule family.
 * Applies specificity-first resolution: the rule with the most matching conditions wins.
 * Falls back to explicit priority if specificity is tied.
 * When rules genuinely conflict with equal specificity and priority, stops and logs —
 * NEVER resolves randomly.
 *
 * This service does NOT execute decisions. It selects which rules to apply.
 */

import { CanonicalRule } from '@mizan/shared';
import { RuleMatchResult } from './rule-matcher.service';
import { RuleConflictDetectorService, RuleConflictReport } from './rule-conflict-detector.service';

export type ResolutionStatus =
  | 'RESOLVED'
  | 'NO_RULES_MATCHED'
  | 'RULE_CONFLICT_DETECTED'
  | 'PARTIAL_CONFLICT';

export interface ResolutionTrace {
  ruleId: string;
  ruleVersion: string;
  titleEn: string;
  madhhab: string;
  selectionReason: string;
  conditionCount: number;
  priority: number;
  wasOverridden: boolean;
  overriddenBy?: string;
}

export interface RuleResolutionOutput {
  status: ResolutionStatus;
  resolvedRules: CanonicalRule[];
  resolutionTrace: ResolutionTrace[];
  conflictReport?: RuleConflictReport;
  resolvedAt: string;
}

export class RuleResolutionService {
  /**
   * From a set of matched rules, resolves the winning set using specificity + priority.
   * Groups rules by ruleFamilyId. Within each family, selects the most specific rule.
   * Rules without a family are treated as independent and always included if matched.
   */
  static async resolveRules(
    matchedResults: RuleMatchResult[],
    madhhab: string,
  ): Promise<RuleResolutionOutput> {
    const resolvedRules: CanonicalRule[] = [];
    const resolutionTrace: ResolutionTrace[] = [];

    if (matchedResults.length === 0) {
      return {
        status: 'NO_RULES_MATCHED',
        resolvedRules: [],
        resolutionTrace: [],
        resolvedAt: new Date().toISOString(),
      };
    }

    // Step 1: Check for conflicts in the full matched set
    const matchedRules = matchedResults.map(r => r.rule);
    const conflictReport = await RuleConflictDetectorService.detectConflicts(matchedRules);

    if (conflictReport.conflictsFound) {
      return {
        status: 'RULE_CONFLICT_DETECTED',
        resolvedRules: [],
        resolutionTrace: [],
        conflictReport,
        resolvedAt: new Date().toISOString(),
      };
    }

    // Step 2: Group by ruleFamilyId
    const familyMap = new Map<string, RuleMatchResult[]>();
    const standaloneRules: RuleMatchResult[] = [];

    for (const result of matchedResults) {
      const familyId = result.rule.identity.ruleFamilyId;
      if (familyId) {
        if (!familyMap.has(familyId)) familyMap.set(familyId, []);
        familyMap.get(familyId)!.push(result);
      } else {
        standaloneRules.push(result);
      }
    }

    // Step 3: For each family, select winning rule by specificity → priority
    for (const [familyId, familyResults] of familyMap) {
      const sorted = familyResults.sort((a, b) => {
        // Primary: more conditions = more specific = higher ranking
        const specDiff = b.conditionCount - a.conditionCount;
        if (specDiff !== 0) return specDiff;
        // Secondary: explicit priority (higher = wins)
        const priA = a.rule.scope.priority ?? 0;
        const priB = b.rule.scope.priority ?? 0;
        return priB - priA;
      });

      const winner = sorted[0];
      const runner = sorted[1];

      // Check for genuine tie (same specificity AND same priority) — stop and log
      if (
        runner &&
        winner.conditionCount === runner.conditionCount &&
        (winner.rule.scope.priority ?? 0) === (runner.rule.scope.priority ?? 0)
      ) {
        return {
          status: 'RULE_CONFLICT_DETECTED',
          resolvedRules: [],
          resolutionTrace: [],
          conflictReport: {
            conflictsFound: true,
            conflictCount: 1,
            conflicts: [{
              ruleIdA: winner.rule.identity.ruleId,
              ruleIdB: runner.rule.identity.ruleId,
              conflictType: 'DECLARED_INCOMPATIBLE',
              reason: `Family "${familyId}" has two matched rules with equal specificity (${winner.conditionCount} conditions) and equal priority. Cannot resolve automatically.`,
              resolutionRequired: 'GOVERNANCE_REVIEW',
            }],
            detectedAt: new Date().toISOString(),
          },
          resolvedAt: new Date().toISOString(),
        };
      }

      resolvedRules.push(winner.rule);
      resolutionTrace.push({
        ruleId: winner.rule.identity.ruleId,
        ruleVersion: winner.rule.identity.ruleVersion,
        titleEn: winner.rule.titles.titleEn,
        madhhab,
        selectionReason: runner
          ? `Most specific: ${winner.conditionCount} conditions vs ${runner.conditionCount}`
          : 'Only matched rule in family',
        conditionCount: winner.conditionCount,
        priority: winner.rule.scope.priority ?? 0,
        wasOverridden: false,
      });

      // Log overridden runners
      for (let i = 1; i < sorted.length; i++) {
        resolutionTrace.push({
          ruleId: sorted[i].rule.identity.ruleId,
          ruleVersion: sorted[i].rule.identity.ruleVersion,
          titleEn: sorted[i].rule.titles.titleEn,
          madhhab,
          selectionReason: 'Overridden by more specific rule',
          conditionCount: sorted[i].conditionCount,
          priority: sorted[i].rule.scope.priority ?? 0,
          wasOverridden: true,
          overriddenBy: winner.rule.identity.ruleId,
        });
      }
    }

    // Step 4: Add standalone rules directly
    for (const result of standaloneRules) {
      resolvedRules.push(result.rule);
      resolutionTrace.push({
        ruleId: result.rule.identity.ruleId,
        ruleVersion: result.rule.identity.ruleVersion,
        titleEn: result.rule.titles.titleEn,
        madhhab,
        selectionReason: 'Standalone rule — no family grouping',
        conditionCount: result.conditionCount,
        priority: result.rule.scope.priority ?? 0,
        wasOverridden: false,
      });
    }

    return {
      status: 'RESOLVED',
      resolvedRules,
      resolutionTrace,
      resolvedAt: new Date().toISOString(),
    };
  }
}
