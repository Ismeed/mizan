/**
 * MIZAN — Rule Executor Service
 *
 * Executes the typed decisions of resolved rules against a mutable result context.
 * Uses a DecisionHandlerRegistry — no arbitrary code execution.
 *
 * CRITICAL: The executor does NOT modify facts. It only reads facts and writes
 * to the ExecutionContext (output accumulator).
 *
 * Each handler receives the typed decision payload and the execution context.
 * Handlers must be deterministic and free of side effects.
 */

import {
  CanonicalRule,
  RuleDecision,
  RuleExecutionTrace,
  AppliedRule,
  DecisionExecutionResult,
} from '@mizan/shared';

// ─── Execution Context ─────────────────────────────────────────────────────────

/**
 * Mutable result accumulator modified by decision handlers.
 * The executor writes to this; the calling service reads from it.
 */
export interface RuleExecutionContext {
  module: 'MIRATH' | 'ZAKAT';
  madhhab: string;
  /** Decisions applied so far (by type) */
  appliedDecisions: DecisionExecutionResult[];
  /** Warnings collected */
  warnings: string[];
  /** Whether the calculation branch was stopped */
  branchStopped: boolean;
  branchStopReason?: string;
  /** Whether a mandatory scholar review is required */
  requiresScholarReview: boolean;
  scholarReviewReason?: string;
  /** Module-specific output accumulator */
  moduleOutput: Record<string, unknown>;
}

// ─── Decision Handlers ─────────────────────────────────────────────────────────

type DecisionHandler = (
  decision: any,
  context: RuleExecutionContext,
  facts: Record<string, unknown>,
) => DecisionExecutionResult;

const DECISION_HANDLERS: Partial<Record<RuleDecision['decisionType'], DecisionHandler>> = {

  ASSIGN_FIXED_FRACTION: (decision, context) => {
    context.moduleOutput[`fraction_${decision.targetEntity}`] = decision.fraction;
    context.moduleOutput[`distributionMethod_${decision.targetEntity}`] = decision.distributionMethod;
    return {
      decisionType: 'ASSIGN_FIXED_FRACTION',
      success: true,
      appliedTo: decision.targetEntity,
      metadata: { fraction: decision.fraction, distributionMethod: decision.distributionMethod },
    };
  },

  ASSIGN_RESIDUARY_STATUS: (decision, context) => {
    context.moduleOutput[`residuaryClass_${decision.targetEntity}`] = decision.residuaryClass;
    return {
      decisionType: 'ASSIGN_RESIDUARY_STATUS',
      success: true,
      appliedTo: decision.targetEntity,
      metadata: { residuaryClass: decision.residuaryClass },
    };
  },

  BLOCK_HEIR: (decision, context) => {
    const blocked = (context.moduleOutput.blockedHeirs as string[]) ?? [];
    blocked.push(decision.targetEntity);
    context.moduleOutput.blockedHeirs = blocked;
    return {
      decisionType: 'BLOCK_HEIR',
      success: true,
      appliedTo: decision.targetEntity,
      metadata: { blockingEntity: decision.blockingEntity, blockingType: decision.blockingType, reasonCode: decision.reasonCode },
    };
  },

  REDUCE_SHARE: (decision, context) => {
    context.moduleOutput[`shareReduction_${decision.targetEntity}`] = {
      method: decision.reductionMethod,
      reducedFraction: decision.reducedFraction,
    };
    return {
      decisionType: 'REDUCE_SHARE',
      success: true,
      appliedTo: decision.targetEntity,
      metadata: { reductionMethod: decision.reductionMethod },
    };
  },

  CHANGE_ELIGIBILITY: (decision, context) => {
    context.moduleOutput[`eligibility_${decision.targetEntity}`] = decision.eligibilityStatus;
    return {
      decisionType: 'CHANGE_ELIGIBILITY',
      success: true,
      appliedTo: decision.targetEntity,
      metadata: { eligibilityStatus: decision.eligibilityStatus, reasonCode: decision.reasonCode },
    };
  },

  SET_ZAKAT_RATE: (decision, context) => {
    context.moduleOutput.zakatRate = decision.rateAsRational;
    context.moduleOutput.zakatRateBasisPoints = decision.rateBasisPoints;
    context.moduleOutput.zakatRateLabel = decision.rateLabel;
    return {
      decisionType: 'SET_ZAKAT_RATE',
      success: true,
      appliedTo: 'ZAKAT_CALCULATION',
      metadata: { rateBasisPoints: decision.rateBasisPoints, rateAsRational: decision.rateAsRational },
    };
  },

  SET_NISAB_METHOD: (decision, context) => {
    context.moduleOutput.nisabMethod = decision.nisabMethod;
    if (decision.goldGrams) context.moduleOutput.nisabGoldGrams = decision.goldGrams;
    if (decision.silverGrams) context.moduleOutput.nisabSilverGrams = decision.silverGrams;
    return {
      decisionType: 'SET_NISAB_METHOD',
      success: true,
      appliedTo: 'ZAKAT_NISAB',
      metadata: { nisabMethod: decision.nisabMethod },
    };
  },

  APPLY_LIVESTOCK_SCHEDULE: (decision, context) => {
    context.moduleOutput.livestockScheduleId = decision.scheduleId;
    context.moduleOutput.livestockScheduleVersion = decision.scheduleVersion;
    return {
      decisionType: 'APPLY_LIVESTOCK_SCHEDULE',
      success: true,
      appliedTo: decision.livestockType,
      metadata: { scheduleId: decision.scheduleId },
    };
  },

  SET_HOLDING_PERIOD: (decision, context) => {
    context.moduleOutput.hawlLunarMonths = decision.lunarMonths;
    return {
      decisionType: 'SET_HOLDING_PERIOD',
      success: true,
      appliedTo: 'HAWL',
      metadata: { lunarMonths: decision.lunarMonths },
    };
  },

  AGGREGATE_ASSET_CATEGORIES: (decision, context) => {
    const existing = (context.moduleOutput.aggregatedCategories as string[]) ?? [];
    context.moduleOutput.aggregatedCategories = [...existing, ...decision.categories];
    context.moduleOutput.aggregationMethod = decision.aggregationMethod;
    return {
      decisionType: 'AGGREGATE_ASSET_CATEGORIES',
      success: true,
      appliedTo: 'ASSET_AGGREGATION',
      metadata: { categories: decision.categories, aggregationMethod: decision.aggregationMethod },
    };
  },

  EXCLUDE_ASSET_CATEGORY: (decision, context) => {
    const excluded = (context.moduleOutput.excludedCategories as string[]) ?? [];
    excluded.push(decision.category);
    context.moduleOutput.excludedCategories = excluded;
    return {
      decisionType: 'EXCLUDE_ASSET_CATEGORY',
      success: true,
      appliedTo: decision.category,
      metadata: { reasonCode: decision.reasonCode },
    };
  },

  REQUIRE_SCHOLAR_REVIEW: (decision, context) => {
    context.requiresScholarReview = true;
    context.scholarReviewReason = decision.reasonCode;
    if (decision.severity === 'MANDATORY_STOP') {
      context.branchStopped = true;
      context.branchStopReason = `Scholar review required: ${decision.reasonCode}`;
    }
    return {
      decisionType: 'REQUIRE_SCHOLAR_REVIEW',
      success: true,
      appliedTo: decision.affectedTopic,
      metadata: { reasonCode: decision.reasonCode, severity: decision.severity },
    };
  },

  ADD_WARNING: (decision, context) => {
    context.warnings.push(decision.userMessage);
    return {
      decisionType: 'ADD_WARNING',
      success: true,
      appliedTo: 'CALCULATION_OUTPUT',
      metadata: { warningCode: decision.warningCode, userMessage: decision.userMessage },
    };
  },

  STOP_CALCULATION_BRANCH: (decision, context) => {
    context.branchStopped = true;
    context.branchStopReason = decision.reasonCode;
    return {
      decisionType: 'STOP_CALCULATION_BRANCH',
      success: true,
      appliedTo: 'CALCULATION_BRANCH',
      metadata: { reasonCode: decision.reasonCode, requiresManualReview: decision.requiresManualReview },
    };
  },
};

// ─── Executor ─────────────────────────────────────────────────────────────────

export class RuleExecutorService {
  static readonly ENGINE_VERSION = '1.0.0';

  /**
   * Executes all decisions of all resolved rules in sequence.
   * Stops if a rule triggers STOP_CALCULATION_BRANCH or REQUIRE_SCHOLAR_REVIEW(MANDATORY_STOP).
   */
  static executeRules(
    resolvedRules: CanonicalRule[],
    facts: Record<string, unknown>,
    calculationId: string,
    module: 'MIRATH' | 'ZAKAT',
    madhhab: string,
    knowledgeReleaseVersion: string,
  ): { context: RuleExecutionContext; trace: RuleExecutionTrace } {
    const context: RuleExecutionContext = {
      module,
      madhhab,
      appliedDecisions: [],
      warnings: [],
      branchStopped: false,
      requiresScholarReview: false,
      moduleOutput: {},
    };

    const appliedRules: AppliedRule[] = [];

    for (const rule of resolvedRules) {
      if (context.branchStopped) break;

      const decisionsApplied: RuleDecision['decisionType'][] = [];

      for (const decision of rule.decisions) {
        if (context.branchStopped) break;

        const handler = DECISION_HANDLERS[decision.decisionType];
        if (!handler) {
          context.warnings.push(`Unknown decision type: ${decision.decisionType} in rule ${rule.identity.ruleId}`);
          continue;
        }

        const result = handler(decision, context, facts);
        context.appliedDecisions.push(result);
        decisionsApplied.push(decision.decisionType);
      }

      appliedRules.push({
        ruleId: rule.identity.ruleId,
        ruleVersion: rule.identity.ruleVersion,
        ruleType: rule.scope.ruleType,
        titleEn: rule.titles.titleEn,
        madhhabScope: rule.scope.madhhabScope,
        evidenceRefs: rule.evidenceRefs,
        decisionsApplied,
      });
    }

    const trace: RuleExecutionTrace = {
      calculationId,
      knowledgeReleaseVersion,
      ruleEngineVersion: RuleExecutorService.ENGINE_VERSION,
      madhhab,
      appliedRules,
      conflictsDetected: false,
      executedAt: new Date().toISOString(),
      totalRulesEvaluated: resolvedRules.length,
      totalRulesMatched: resolvedRules.length,
      totalRulesApplied: appliedRules.length,
    };

    return { context, trace };
  }
}
