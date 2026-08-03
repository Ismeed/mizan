/**
 * MIZAN — AI Livestock Context Service (Phase 9)
 *
 * Prepares verified, structured context packages for the AI Assistant.
 * Enforces strict anti-recalculation constraints.
 */

import type { AILivestockContextPackage, LivestockAssetResult } from '@mizan/shared';

export class AILivestockContextService {
  public buildContextPackage(
    result: LivestockAssetResult,
    calculationId: string,
    madhhab: string,
    languageTag: string = 'en',
    currencyCode: string = 'NGN'
  ): AILivestockContextPackage {
    return {
      task: 'EXPLAIN_LIVESTOCK_ZAKAT_RESULT',
      calculationContext: {
        calculationId,
        selectedMadhhab: madhhab,
        languageTag,
        currencyCode,
        knowledgeReleaseVersion: result.knowledgeReleaseVersion,
        ruleEngineVersion: result.ruleEngineVersion,
      },
      livestockContext: {
        categoryId: result.categoryId,
        animalTypeId: result.animalTypeId,
        inputFacts: result.inputSummary as any,
        eligibilityResult: result.eligibility as any,
        scheduleId: result.scheduleResolution.scheduleId,
        scheduleVersion: result.scheduleResolution.scheduleVersion,
        matchedBandId: result.scheduleResolution.matchedBandId,
        matchedPatternId: result.scheduleResolution.matchedPatternId,
        resolvedObligation: result.obligation as any,
      },
      approvedContext: {
        explanations: result.explanationIds.map(id => ({
          explanationId: id,
          text: `Approved explanation record ${id}.`,
        })),
        evidence: result.evidence.map(e => ({
          evidenceId: e.evidenceId,
          referenceLabel: e.referenceLabel,
        })),
        fiqhReferences: [],
      },
      restrictions: {
        mustNotRecalculate: true,
        mustNotChangeObligation: true,
        mustNotInventThreshold: true,
        mustNotInventAnimalClass: true,
        mustNotInventAlternative: true,
        mustNotInventEvidence: true,
        mustNotSwitchMadhhab: true,
        mustUseProvidedApprovedContext: true,
        mustDiscloseInsufficientContext: true,
      },
    };
  }
}
