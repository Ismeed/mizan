/**
 * AI Evidence Context Contract (Phase 4)
 * Prepared verified context package with explicit AI safety restrictions.
 */

export interface AIEvidenceContextRestrictions {
  mustNotRecalculate: boolean;
  mustNotChangeDecision: boolean;
  mustNotInventEvidence: boolean;
  mustNotInventTranslation: boolean;
  mustNotInventHadithNumber: boolean;
  mustNotSwitchMadhhab: boolean;
  mustUseProvidedContext: boolean;
  mustDiscloseInsufficientEvidence: boolean;
}

export interface AIEvidenceContext {
  task: 'EXPLAIN_EVIDENCE' | 'COMPARE_MADHHAB' | 'GENERAL_EXPLANATION';
  calculationContext: {
    calculationId?: string;
    module: 'MIRATH' | 'ZAKAT';
    selectedMadhhab: string;
    currencyCode: string;
    languageTag: string;
    ruleEngineVersion: string;
    knowledgeReleaseVersion: string;
  };
  ruleContext: {
    ruleId: string;
    ruleVersion: string;
    decisionType: string;
    structuredDecision: Record<string, any>;
    approvedExplanation?: string;
  };
  evidenceContext: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType: string;
    canonicalReference: string;
    originalText: string;
    approvedTranslation: string;
    approvedTranslationSource?: string;
    madhhabScope: string[];
    fiqhContext?: string[];
  };
  restrictions: AIEvidenceContextRestrictions;
}

export function getDefaultAIRestrictions(): AIEvidenceContextRestrictions {
  return {
    mustNotRecalculate: true,
    mustNotChangeDecision: true,
    mustNotInventEvidence: true,
    mustNotInventTranslation: true,
    mustNotInventHadithNumber: true,
    mustNotSwitchMadhhab: true,
    mustUseProvidedContext: true,
    mustDiscloseInsufficientEvidence: true,
  };
}
