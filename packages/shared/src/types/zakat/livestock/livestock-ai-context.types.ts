/**
 * MIZAN — AI Assistant Livestock Context Contract (Phase 9)
 *
 * Prepares verified, structured context packages for the AI Assistant.
 *
 * CRITICAL:
 * - AI Assistant MUST NOT calculate livestock Zakat
 * - AI Assistant explains approved calculations and evidence only
 */

export interface AILivestockContextRestrictions {
  mustNotRecalculate: true;
  mustNotChangeObligation: true;
  mustNotInventThreshold: true;
  mustNotInventAnimalClass: true;
  mustNotInventAlternative: true;
  mustNotInventEvidence: true;
  mustNotSwitchMadhhab: true;
  mustUseProvidedApprovedContext: true;
  mustDiscloseInsufficientContext: true;
}

export interface AILivestockContextPackage {
  task: 'EXPLAIN_LIVESTOCK_ZAKAT_RESULT';
  calculationContext: {
    calculationId: string;
    selectedMadhhab: string;
    languageTag: string;
    currencyCode: string;
    knowledgeReleaseVersion: string;
    ruleEngineVersion: string;
  };
  livestockContext: {
    categoryId: string;
    animalTypeId: string;
    inputFacts: Record<string, unknown>;
    eligibilityResult: Record<string, unknown>;
    scheduleId: string;
    scheduleVersion: string;
    matchedBandId?: string | null;
    matchedPatternId?: string | null;
    resolvedObligation: Record<string, unknown>;
  };
  approvedContext: {
    explanations: Array<{ explanationId: string; text: string }>;
    evidence: Array<{ evidenceId: string; referenceLabel: string }>;
    fiqhReferences: Array<{ referenceId: string; title: string }>;
  };
  restrictions: AILivestockContextRestrictions;
}
