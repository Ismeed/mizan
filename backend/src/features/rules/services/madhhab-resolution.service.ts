/**
 * MIZAN — Madhhab Resolution Service (Phase 5)
 *
 * Full orchestrator for Madhhab-specific rule resolution.
 * Integrates MadhhabFilterService, RuleMatcherService, MadhhabOverrideService,
 * and RuleResolutionService to deterministically select the winning rule set.
 * Writes immutable MadhhabResolutionAudit log per calculation execution.
 */

import { prisma } from '../../../config/database';
import {
  CanonicalRule,
  MadhhabResolutionOutput,
  MadhhabResolutionTrace,
  MadhhabBranchStrategy,
} from '@mizan/shared';
import { MadhhabFilterService } from './madhhab-filter.service';
import { RuleMatcherService, RuleMatchResult } from './rule-matcher.service';
import { MadhhabOverrideService } from './madhhab-override.service';
import { RuleResolutionService } from './rule-resolution.service';

export interface ResolveForMadhhabParams {
  candidateRules: CanonicalRule[];
  facts: Record<string, unknown>;
  madhhab: string;
  calculationId?: string;
  profileId?: string;
}

export class MadhhabResolutionService {
  /**
   * Deterministically resolves winning rules for a given calculation using the frozen profile madhhab.
   */
  static async resolveForMadhhab(params: ResolveForMadhhabParams): Promise<MadhhabResolutionOutput> {
    const { candidateRules, facts, madhhab, calculationId, profileId } = params;

    // Step 1: Pre-filter by Madhhab
    const filterResult = MadhhabFilterService.filterRules(candidateRules, madhhab);

    if (filterResult.applicableRules.length === 0) {
      const output: MadhhabResolutionOutput = {
        status: 'NO_RULES_MATCHED',
        resolvedRules: [],
        resolutionTrace: [],
        branchesSelected: [],
        resolvedAt: new Date().toISOString(),
      };

      if (calculationId) {
        await MadhhabResolutionService.writeAuditRecord({
          calculationId,
          madhhab,
          profileId,
          rulesEvaluatedCount: candidateRules.length,
          rulesAfterFilterCount: 0,
          branchesSelected: [],
          resolutionTrace: [],
          conflictDetected: false,
        });
      }

      return output;
    }

    // Step 2: Evaluate declarative conditions on filtered rules
    const matchOutput = RuleMatcherService.matchRules(filterResult.applicableRules, facts);

    if (matchOutput.matchedRules.length === 0) {
      const output: MadhhabResolutionOutput = {
        status: 'NO_RULES_MATCHED',
        resolvedRules: [],
        resolutionTrace: [],
        branchesSelected: [],
        resolvedAt: new Date().toISOString(),
      };

      if (calculationId) {
        await MadhhabResolutionService.writeAuditRecord({
          calculationId,
          madhhab,
          profileId,
          rulesEvaluatedCount: candidateRules.length,
          rulesAfterFilterCount: filterResult.applicableRules.length,
          branchesSelected: [],
          resolutionTrace: [],
          conflictDetected: false,
        });
      }

      return output;
    }

    // Step 3: Group matched rules by ruleFamilyId and apply Madhhab Override logic
    const familyMap = new Map<string, CanonicalRule[]>();
    const standaloneRules: CanonicalRule[] = [];

    for (const matchResult of matchOutput.matchedRules) {
      const familyId = matchResult.rule.identity.ruleFamilyId;
      if (familyId) {
        if (!familyMap.has(familyId)) familyMap.set(familyId, []);
        familyMap.get(familyId)!.push(matchResult.rule);
      } else {
        standaloneRules.push(matchResult.rule);
      }
    }

    const overrideWinners: RuleMatchResult[] = [];
    const branchesSelected: MadhhabResolutionOutput['branchesSelected'] = [];
    const resolutionTrace: MadhhabResolutionTrace[] = [];

    for (const [familyId, familyRules] of familyMap) {
      const overrideRes = MadhhabOverrideService.resolveFamilyOverride(familyRules, madhhab);

      // Determine branch strategy tag
      let branchStrategy: MadhhabBranchStrategy = 'SHARED_BASE';
      if (overrideRes.overrideApplied) {
        branchStrategy = 'NARROW_OVERRIDE';
      } else if (familyRules.some(r => r.scope?.madhhabScope?.includes('JAFARI'))) {
        branchStrategy = 'FULL_BRANCH';
      } else if (familyRules.length > 1) {
        branchStrategy = 'PARTIAL_AGREEMENT';
      }

      branchesSelected.push({
        ruleFamilyId: familyId,
        branchStrategy,
        selectedRuleId: overrideRes.selectedRule.identity.ruleId,
      });

      // Wrap back into RuleMatchResult format
      const originalMatch = matchOutput.matchedRules.find(
        m => m.rule.identity.ruleId === overrideRes.selectedRule.identity.ruleId
      )!;

      overrideWinners.push(originalMatch);

      resolutionTrace.push({
        ruleId: overrideRes.selectedRule.identity.ruleId,
        ruleVersion: overrideRes.selectedRule.identity.ruleVersion,
        titleEn: overrideRes.selectedRule.titles.titleEn,
        madhhab,
        selectionReason: overrideRes.reason,
        conditionCount: originalMatch.conditionCount,
        priority: overrideRes.selectedRule.scope?.priority ?? 0,
        wasOverridden: false,
        branchStrategy,
        madhhabFiltered: true,
        overrideApplied: overrideRes.overrideApplied,
      });

      for (const overridden of overrideRes.overriddenRules) {
        const origMatch = matchOutput.matchedRules.find(
          m => m.rule.identity.ruleId === overridden.identity.ruleId
        );
        resolutionTrace.push({
          ruleId: overridden.identity.ruleId,
          ruleVersion: overridden.identity.ruleVersion,
          titleEn: overridden.titles.titleEn,
          madhhab,
          selectionReason: 'Overridden by higher specificity madhhab rule',
          conditionCount: origMatch?.conditionCount ?? 0,
          priority: overridden.scope?.priority ?? 0,
          wasOverridden: true,
          overriddenBy: overrideRes.selectedRule.identity.ruleId,
          branchStrategy,
          madhhabFiltered: true,
          overrideApplied: true,
          overriddenBaseRuleId: overrideRes.selectedRule.identity.ruleId,
        });
      }
    }

    // Add standalone rules
    for (const rule of standaloneRules) {
      const origMatch = matchOutput.matchedRules.find(
        m => m.rule.identity.ruleId === rule.identity.ruleId
      )!;
      overrideWinners.push(origMatch);
      resolutionTrace.push({
        ruleId: rule.identity.ruleId,
        ruleVersion: rule.identity.ruleVersion,
        titleEn: rule.titles.titleEn,
        madhhab,
        selectionReason: 'Standalone rule — no family grouping',
        conditionCount: origMatch.conditionCount,
        priority: rule.scope?.priority ?? 0,
        wasOverridden: false,
        branchStrategy: 'SHARED_BASE',
        madhhabFiltered: true,
        overrideApplied: false,
      });
    }

    // Step 4: Run final specificity & priority tie-break using base RuleResolutionService
    const baseRes = await RuleResolutionService.resolveRules(overrideWinners, madhhab);

    const output: MadhhabResolutionOutput = {
      status: baseRes.status,
      resolvedRules: baseRes.resolvedRules,
      resolutionTrace,
      branchesSelected,
      conflictReport: baseRes.conflictReport,
      resolvedAt: new Date().toISOString(),
    };

    if (calculationId) {
      await MadhhabResolutionService.writeAuditRecord({
        calculationId,
        madhhab,
        profileId,
        rulesEvaluatedCount: candidateRules.length,
        rulesAfterFilterCount: filterResult.applicableRules.length,
        branchesSelected,
        resolutionTrace,
        conflictDetected: baseRes.status === 'RULE_CONFLICT_DETECTED',
        conflictDetails: baseRes.conflictReport?.conflicts ?? [],
      });
    }

    return output;
  }

  /**
   * Writes an immutable MadhhabResolutionAudit log record to the database.
   */
  private static async writeAuditRecord(data: {
    calculationId: string;
    madhhab: string;
    profileId?: string;
    rulesEvaluatedCount: number;
    rulesAfterFilterCount: number;
    branchesSelected: any[];
    resolutionTrace: any[];
    conflictDetected: boolean;
    conflictDetails?: any[];
  }): Promise<void> {
    try {
      await (prisma as any).madhhabResolutionAudit.create({
        data: {
          calculation_id: data.calculationId,
          madhhab: data.madhhab,
          profile_id: data.profileId,
          rules_evaluated_count: data.rulesEvaluatedCount,
          rules_after_filter_count: data.rulesAfterFilterCount,
          branches_selected_json: data.branchesSelected,
          resolution_trace_json: data.resolutionTrace,
          conflict_detected: data.conflictDetected,
          conflict_details_json: data.conflictDetails ?? [],
        },
      });
    } catch (err) {
      console.error('[MadhhabResolutionService] Audit write failed:', err);
    }
  }
}
