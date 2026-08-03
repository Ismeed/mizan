/**
 * MIZAN — AI Result Context Service (Phase 13)
 * Packages authoritative calculation result context for AI Assistant explanations.
 * Enforces all 10 strict AI restrictions.
 */

import type { CalculationResultEnvelope, AIResultContextPackage } from '@mizan/shared';

export class AIResultContextService {
  static packageResultContext(
    envelope: CalculationResultEnvelope,
    targetResultItemId?: string
  ): AIResultContextPackage {
    const targetItem = targetResultItemId
      ? envelope.resultItems.find((i) => i.resultItemId === targetResultItemId)
      : envelope.resultItems[0];

    const resultItemContext = targetItem
      ? {
          resultItemId: targetItem.resultItemId,
          itemType: targetItem.itemType,
          subject: targetItem.subject as unknown as Record<string, unknown>,
          status: targetItem.status,
          decision: targetItem.decision as unknown as Record<string, unknown>,
          exactValues: targetItem.exactValues as unknown as Record<string, unknown>,
          monetaryValues: targetItem.monetaryValues as unknown as unknown[],
        }
      : {
          resultItemId: 'none',
          itemType: 'NONE',
          subject: {},
          status: envelope.status,
          decision: {},
          exactValues: {},
          monetaryValues: [],
        };

    return {
      task: 'EXPLAIN_CALCULATION_RESULT',
      calculationContext: {
        calculationId: envelope.calculationId,
        resultId: envelope.resultId,
        module: envelope.module,
        selectedMadhhab: envelope.profile.madhhab,
        languageTag: envelope.profile.language.languageTag,
        knowledgeReleaseVersion: envelope.context.knowledgeReleaseVersion,
        ruleEngineVersion: envelope.context.ruleEngineVersion,
      },
      resultContext: resultItemContext,
      approvedContext: {
        appliedRules: targetItem?.ruleResolution.appliedRules ?? [],
        evidence: targetItem?.evidence ?? [],
        explanations: targetItem?.explanations ?? [],
      },
      restrictions: {
        mustNotRecalculate: true,
        mustNotChangeResult: true,
        mustNotChangeMadhhab: true,
        mustNotInventRule: true,
        mustNotInventEvidence: true,
        mustNotInventFraction: true,
        mustNotInventRate: true,
        mustNotModifyMoney: true,
        mustUseProvidedResultContract: true,
        mustDiscloseInsufficientContext: true,
      },
    };
  }
}
