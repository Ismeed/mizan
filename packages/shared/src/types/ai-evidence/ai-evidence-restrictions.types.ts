/**
 * Strict AI Restrictions Contract (Phase 16)
 * Explicit non-negotiable boundaries divided by functional scope.
 */

export interface AICalculationRestrictions {
  mustNotRecalculate: true;
  mustNotChangeDecision: true;
  mustNotChangeExactFraction: true;
  mustNotChangeExactRate: true;
  mustNotChangeQuantity: true;
  mustNotChangeMonetaryValue: true;
  mustNotCreateAlternativeResult: true;
}

export interface AIMadhhabRestrictions {
  mustNotSwitchMadhhab: true;
  mustNotMergeMadhhabPositions: true;
  mustNotInferComparativePositions: true;
}

export interface AIEvidenceRestrictions {
  mustNotInventEvidence: true;
  mustNotInventSourceText: true;
  mustNotInventReferenceNumber: true;
  mustNotInventPageNumber: true;
  mustNotInventTranslation: true;
  mustNotAlterQuotedText: true;
  mustNotPresentCommentaryAsSourceText: true;
}

export interface AIRuleRestrictions {
  mustNotInventRule: true;
  mustNotInventException: true;
  mustNotOverrideDeterministicRule: true;
}

export interface AIEvidenceCurrencyRestrictions {
  mustNotInventExchangeRate: true;
  mustNotRevalueAssets: true;
  mustNotPresentConversionAsReligiousRuling: true;
}

export interface AIResponseRestrictions {
  mustUseVerifiedPackageOnly: true;
  mustLabelAIClarification: true;
  mustDiscloseInsufficientContext: true;
  mustNotClaimFatwaAuthority: true;
}

export interface StrictAIEvidenceRestrictions {
  calculation: AICalculationRestrictions;
  madhhab: AIMadhhabRestrictions;
  evidence: AIEvidenceRestrictions;
  rules: AIRuleRestrictions;
  currency: AIEvidenceCurrencyRestrictions;
  response: AIResponseRestrictions;
}

export function getStrictAIEvidenceRestrictions(): StrictAIEvidenceRestrictions {
  return {
    calculation: {
      mustNotRecalculate: true,
      mustNotChangeDecision: true,
      mustNotChangeExactFraction: true,
      mustNotChangeExactRate: true,
      mustNotChangeQuantity: true,
      mustNotChangeMonetaryValue: true,
      mustNotCreateAlternativeResult: true,
    },
    madhhab: {
      mustNotSwitchMadhhab: true,
      mustNotMergeMadhhabPositions: true,
      mustNotInferComparativePositions: true,
    },
    evidence: {
      mustNotInventEvidence: true,
      mustNotInventSourceText: true,
      mustNotInventReferenceNumber: true,
      mustNotInventPageNumber: true,
      mustNotInventTranslation: true,
      mustNotAlterQuotedText: true,
      mustNotPresentCommentaryAsSourceText: true,
    },
    rules: {
      mustNotInventRule: true,
      mustNotInventException: true,
      mustNotOverrideDeterministicRule: true,
    },
    currency: {
      mustNotInventExchangeRate: true,
      mustNotRevalueAssets: true,
      mustNotPresentConversionAsReligiousRuling: true,
    },
    response: {
      mustUseVerifiedPackageOnly: true,
      mustLabelAIClarification: true,
      mustDiscloseInsufficientContext: true,
      mustNotClaimFatwaAuthority: true,
    },
  };
}
