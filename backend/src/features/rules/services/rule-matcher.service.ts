/**
 * MIZAN — Rule Matcher Service
 *
 * Evaluates candidate rules against canonical facts and returns matched rules.
 * Uses the declarative condition evaluator — never executes arbitrary code.
 *
 * INVARIANTS:
 *  - Never modifies the facts object
 *  - Never executes code from rule payloads
 *  - Returns full evaluation trace for every candidate
 */

import {
  CanonicalRule,
  evaluateCondition,
  ConditionEvaluationResult,
} from '@mizan/shared';

export interface RuleMatchResult {
  rule: CanonicalRule;
  matched: boolean;
  evaluationTrace: ConditionEvaluationResult;
  conditionCount: number;
}

export interface RuleMatcherOutput {
  matchedRules: RuleMatchResult[];
  unmatchedRules: RuleMatchResult[];
  totalCandidates: number;
  totalMatched: number;
  evaluatedAt: string;
}

export class RuleMatcherService {
  /**
   * Evaluates all candidate rules against the provided canonical facts.
   *
   * @param candidateRules - Rules filtered by module + madhhab from the Registry
   * @param facts - Canonical facts object (CanonicalMirathFacts or CanonicalZakatFacts)
   */
  static matchRules(
    candidateRules: CanonicalRule[],
    facts: Record<string, unknown>,
  ): RuleMatcherOutput {
    const matchedRules: RuleMatchResult[] = [];
    const unmatchedRules: RuleMatchResult[] = [];

    for (const rule of candidateRules) {
      const evaluationTrace = evaluateCondition(rule.applicability.conditions, facts);

      // Count number of leaf conditions for specificity scoring
      const conditionCount = RuleMatcherService.countLeafConditions(rule.applicability.conditions);

      const matchResult: RuleMatchResult = {
        rule,
        matched: evaluationTrace.matched,
        evaluationTrace,
        conditionCount,
      };

      if (evaluationTrace.matched) {
        matchedRules.push(matchResult);
      } else {
        unmatchedRules.push(matchResult);
      }
    }

    return {
      matchedRules,
      unmatchedRules,
      totalCandidates: candidateRules.length,
      totalMatched: matchedRules.length,
      evaluatedAt: new Date().toISOString(),
    };
  }

  /** Counts the number of leaf nodes in a condition tree (used for specificity) */
  private static countLeafConditions(condition: any): number {
    if (!condition) return 0;
    if (condition.type === 'LEAF') return 1;
    if (condition.type === 'GROUP' && Array.isArray(condition.conditions)) {
      return condition.conditions.reduce(
        (sum: number, c: any) => sum + RuleMatcherService.countLeafConditions(c),
        0,
      );
    }
    return 0;
  }
}
