/**
 * AI Explanation Context Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { AIExplanationContextPackage, AIRestrictions, RenderedExplanation } from '@mizan/shared';

export class AIExplanationContextService {
  public static buildAIContextPackage(
    calculationId: string,
    renderedExplanation: RenderedExplanation,
    structuredResult: Record<string, any>,
    appliedRuleIds: string[] = ['PERMANENT-RULE-001'],
    reasonCodes: string[] = ['DECISION_APPLIED']
  ): AIExplanationContextPackage {
    const restrictions: AIRestrictions = {
      mustNotRecalculate: true,
      mustNotChangeDecision: true,
      mustNotChangeMadhhab: true,
      mustNotInventRule: true,
      mustNotInventEvidence: true,
      mustNotInventTranslation: true,
      mustNotPresentGeneratedTextAsSourceText: true,
      mustUseApprovedTerminology: true,
      mustDiscloseInsufficientContext: true,
    };

    return {
      task: 'EXPAND_APPROVED_EXPLANATION',
      calculationContext: {
        calculationId,
        selectedMadhhab: renderedExplanation.madhhab.madhhabId,
        languageTag: renderedExplanation.language.resolvedLanguageTag,
        currencyCode: structuredResult.currencyCode || 'NGN',
        knowledgeReleaseVersion: renderedExplanation.source.knowledgeReleaseVersion,
        ruleEngineVersion: '1.0.0',
      },
      decisionContext: {
        structuredResult,
        appliedRuleIds,
        reasonCodes,
      },
      approvedExplanationContext: {
        explanationId: renderedExplanation.explanationId,
        explanationVersion: renderedExplanation.explanationVersion,
        approvedShortText: renderedExplanation.content.short,
        approvedFullText: renderedExplanation.content.full,
        approvedEducationalText: renderedExplanation.content.educational,
        evidence: renderedExplanation.evidence,
      },
      restrictions,
    };
  }
}
