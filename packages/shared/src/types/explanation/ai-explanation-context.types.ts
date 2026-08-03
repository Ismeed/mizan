/**
 * AI Explanation Context Package Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export interface AIRestrictions {
  mustNotRecalculate: true;
  mustNotChangeDecision: true;
  mustNotChangeMadhhab: true;
  mustNotInventRule: true;
  mustNotInventEvidence: true;
  mustNotInventTranslation: true;
  mustNotPresentGeneratedTextAsSourceText: true;
  mustUseApprovedTerminology: true;
  mustDiscloseInsufficientContext: true;
}

export interface AIExplanationContextPackage {
  task: 'EXPAND_APPROVED_EXPLANATION' | 'CLARIFY_CALCULATION_STEP' | 'EDUCATIONAL_QUERY';

  calculationContext: {
    calculationId: string;
    selectedMadhhab: string;
    languageTag: string;
    currencyCode: string;
    knowledgeReleaseVersion: string;
    ruleEngineVersion: string;
  };

  decisionContext: {
    structuredResult: Record<string, any>;
    appliedRuleIds: string[];
    reasonCodes: string[];
  };

  approvedExplanationContext: {
    explanationId: string;
    explanationVersion: string;
    approvedShortText: string;
    approvedFullText: string;
    approvedEducationalText: string | null;
    evidence: any[];
  };

  restrictions: AIRestrictions;
}
