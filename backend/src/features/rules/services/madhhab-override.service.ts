/**
 * MIZAN — Madhhab Override Service (Phase 5)
 *
 * Resolves madhhab-specific overrides within a rule family.
 * When multiple rules match in a family, an explicit single-madhhab override
 * takes precedence over an ALL_SUNNI or ALL_SCHOOLS rule.
 *
 * SCOPE SPECIFICITY RANKING (Higher wins):
 *  Rank 3: Explicit single madhhab match (e.g. ['MALIKI'])
 *  Rank 2: 'ALL_SUNNI' match for Sunni madhhabs
 *  Rank 1: 'ALL_SCHOOLS' match
 */

import { CanonicalRule } from '@mizan/shared';

export interface OverrideResolutionResult {
  selectedRule: CanonicalRule;
  overriddenRules: CanonicalRule[];
  overrideApplied: boolean;
  specificityRank: number;
  reason: string;
}

export class MadhhabOverrideService {
  /**
   * Given candidate matched rules in a single family, resolves the winner based on
   * madhhab scope specificity rank, then condition count, then explicit priority.
   */
  static resolveFamilyOverride(
    familyRules: CanonicalRule[],
    targetMadhhab: string,
  ): OverrideResolutionResult {
    if (familyRules.length === 1) {
      return {
        selectedRule: familyRules[0],
        overriddenRules: [],
        overrideApplied: false,
        specificityRank: MadhhabOverrideService.getMadhhabSpecificityRank(familyRules[0], targetMadhhab),
        reason: 'Single rule in family',
      };
    }

    const normMadhhab = targetMadhhab.toUpperCase();

    // Sort candidate rules by:
    // 1. Madhhab scope specificity rank (descending)
    // 2. Condition count (descending)
    // 3. Explicit priority (descending)
    const sorted = [...familyRules].sort((a, b) => {
      const rankA = MadhhabOverrideService.getMadhhabSpecificityRank(a, normMadhhab);
      const rankB = MadhhabOverrideService.getMadhhabSpecificityRank(b, normMadhhab);
      if (rankB !== rankA) return rankB - rankA;

      const condA = a.applicability?.conditionCount ?? 0;
      const condB = b.applicability?.conditionCount ?? 0;
      if (condB !== condA) return condB - condA;

      const priA = a.scope?.priority ?? 0;
      const priB = b.scope?.priority ?? 0;
      return priB - priA;
    });

    const selectedRule = sorted[0];
    const overriddenRules = sorted.slice(1);
    const topRank = MadhhabOverrideService.getMadhhabSpecificityRank(selectedRule, normMadhhab);
    const secondRank = sorted[1] ? MadhhabOverrideService.getMadhhabSpecificityRank(sorted[1], normMadhhab) : 0;

    const overrideApplied = topRank > secondRank;

    return {
      selectedRule,
      overriddenRules,
      overrideApplied,
      specificityRank: topRank,
      reason: overrideApplied
        ? `Madhhab-specific override selected (rank ${topRank} vs rank ${secondRank})`
        : `Selected most specific rule within rank ${topRank}`,
    };
  }

  /**
   * Computes the Madhhab scope specificity rank for a rule against a target madhhab.
   * Rank 3: Explicit single madhhab
   * Rank 2: ALL_SUNNI
   * Rank 1: ALL_SCHOOLS
   * Rank 0: Not applicable
   */
  static getMadhhabSpecificityRank(rule: CanonicalRule, targetMadhhab: string): number {
    const normMadhhab = targetMadhhab.toUpperCase();
    const scopes = (rule.scope?.madhhabScope ?? []).map(s => String(s).toUpperCase());

    if (scopes.includes(normMadhhab)) {
      // If it explicitly names ONLY this madhhab, highest rank 3
      if (scopes.length === 1 && !['ALL_SUNNI', 'ALL_SCHOOLS'].includes(scopes[0])) {
        return 3;
      }
      return 2.5; // Explicitly includes this madhhab alongside others
    }

    const isSunni = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'].includes(normMadhhab);
    if (scopes.includes('ALL_SUNNI') && isSunni) return 2;
    if (scopes.includes('ALL_SCHOOLS')) return 1;

    return 0;
  }
}
