/**
 * MIZAN — Madhhab Filter Service (Phase 5)
 *
 * Pre-resolution filter that filters candidate rules by the target Madhhab
 * before condition evaluation.
 *
 * SCOPING RULES:
 *  - Explicit madhhab match (e.g. ['HANAFI'] matches 'HANAFI')
 *  - 'ALL_SUNNI' matches HANAFI, MALIKI, SHAFII, and HANBALI (NOT JAFARI)
 *  - 'ALL_SCHOOLS' matches ALL five madhhabs
 *  - Jafari rules ('JAFARI') ONLY match 'JAFARI'
 */

import { CanonicalRule, RuleMadhhabScope } from '@mizan/shared';

export interface MadhhabFilterResult {
  applicableRules: CanonicalRule[];
  filteredOutRules: CanonicalRule[];
  totalCandidates: number;
  totalApplicable: number;
  madhhab: string;
}

export class MadhhabFilterService {
  /**
   * Filters a set of candidate rules to only those applicable for the specified madhhab.
   */
  static filterRules(
    candidateRules: CanonicalRule[],
    targetMadhhab: string,
  ): MadhhabFilterResult {
    const normalizedMadhhab = targetMadhhab.toUpperCase();
    const applicableRules: CanonicalRule[] = [];
    const filteredOutRules: CanonicalRule[] = [];

    const isSunni = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'].includes(normalizedMadhhab);

    for (const rule of candidateRules) {
      const scopeList = (rule.scope?.madhhabScope ?? []).map(s => String(s).toUpperCase());

      const isApplicable = scopeList.some(scope => {
        if (scope === normalizedMadhhab) return true;
        if (scope === 'ALL_SCHOOLS') return true;
        if (scope === 'ALL_SUNNI' && isSunni) return true;
        return false;
      });

      if (isApplicable) {
        applicableRules.push(rule);
      } else {
        filteredOutRules.push(rule);
      }
    }

    return {
      applicableRules,
      filteredOutRules,
      totalCandidates: candidateRules.length,
      totalApplicable: applicableRules.length,
      madhhab: normalizedMadhhab,
    };
  }

  /**
   * Returns true if a specific rule scope is applicable to a given target madhhab.
   */
  static isScopeApplicable(scope: RuleMadhhabScope, targetMadhhab: string): boolean {
    const normScope = String(scope).toUpperCase();
    const normMadhhab = targetMadhhab.toUpperCase();
    const isSunni = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'].includes(normMadhhab);

    if (normScope === normMadhhab) return true;
    if (normScope === 'ALL_SCHOOLS') return true;
    if (normScope === 'ALL_SUNNI' && isSunni) return true;
    return false;
  }
}
