/**
 * AI Evidence Context Contract (Phase 4 & Phase 15)
 * Prepared verified context package with explicit AI safety restrictions.
 */

export interface AIEvidenceContextRestrictions {
  mustNotRecalculate: boolean;
  mustNotChangeDecision: boolean;
  mustNotChangeMadhhab: boolean;
  mustNotSwitchMadhhab?: boolean; // Legacy Phase 4 alias
  mustNotInventEvidence: boolean;
  mustNotInventSourceText: boolean;
  mustNotInventTranslation: boolean;
  mustNotInventHadithNumber?: boolean; // Legacy Phase 4 alias
  mustNotInventRule: boolean;
  mustNotInventException: boolean;
  mustNotPresentCommentaryAsEvidence: boolean;
  mustNotUseUnapprovedComparativeContext: boolean;
  mustUseProvidedContext: boolean;
  mustDiscloseInsufficientEvidence: boolean;
}

export interface AIEvidenceContext {
  task: 'EXPLAIN_EVIDENCE' | 'COMPARE_MADHHAB' | 'GENERAL_EXPLANATION' | 'EXPLAIN_VERIFIED_EVIDENCE';
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
    mustNotChangeMadhhab: true,
    mustNotSwitchMadhhab: true,
    mustNotInventEvidence: true,
    mustNotInventSourceText: true,
    mustNotInventTranslation: true,
    mustNotInventHadithNumber: true,
    mustNotInventRule: true,
    mustNotInventException: true,
    mustNotPresentCommentaryAsEvidence: true,
    mustNotUseUnapprovedComparativeContext: true,
    mustUseProvidedContext: true,
    mustDiscloseInsufficientEvidence: true,
  };
}
