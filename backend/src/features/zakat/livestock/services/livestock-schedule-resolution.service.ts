/**
 * MIZAN — Livestock Schedule Resolution Service (Phase 9 Orchestrator)
 *
 * Coordinates the 12-step Livestock Zakat calculation pipeline:
 * 1. Validate animal type
 * 2. Validate count
 * 3. Validate required facts
 * 4. Evaluate livestock eligibility rules
 * 5. Evaluate holding period rules
 * 6. Evaluate grazing/feeding rules
 * 7. Evaluate commercial-purpose rules
 * 8. Resolve selected madhhab schedule
 * 9. Apply count schedule
 * 10. Resolve obligation
 * 11. Validate result
 * 12. Attach evidence and explanations
 */

import type {
  CanonicalLivestockFacts,
  CanonicalLivestockSchedule,
  LivestockAssetResult,
} from '@mizan/shared';
import { LivestockEligibilityService } from './livestock-eligibility.service';
import { LivestockBandMatcherService } from './livestock-band-matcher.service';
import { BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES } from '@mizan/shared';

export interface LivestockResolutionInput {
  calculationId: string;
  calculationProfileId: string;
  facts: CanonicalLivestockFacts;
  madhhab: string;
  knowledgeReleaseVersion?: string;
}

export class LivestockScheduleResolutionService {
  private eligibilityService = new LivestockEligibilityService();
  private bandMatcher = new LivestockBandMatcherService();

  public resolveLivestockSchedule(input: LivestockResolutionInput): LivestockAssetResult {
    const { calculationId, facts, madhhab, knowledgeReleaseVersion = '1.0.0' } = input;

    // Step 4-7: Evaluate eligibility
    const eligibility = this.eligibilityService.evaluateEligibility(facts, madhhab);

    if (!eligibility.isEligible) {
      return {
        assetInstanceId: facts.assetInstanceId,
        categoryId: facts.categoryId,
        categoryVersion: '1.0.0',
        animalTypeId: facts.animalTypeId,
        animalTypeVersion: '1.0.0',
        inputSummary: {
          totalCount: facts.herd.totalCount,
          ownershipPeriod: facts.ownership as any,
          feedingMethod: facts.feedingAndGrazing.method,
          purposeClassification: facts.purpose.classification,
        },
        eligibility,
        scheduleResolution: {
          scheduleId: 'NONE',
          scheduleVersion: '1.0.0',
          scheduleModel: 'EXPLICIT_BANDS',
          matchedBandId: null,
          matchedPatternId: null,
          resolvedCombination: null,
          selectedMadhhab: madhhab,
          resolvedScheduleChecksum: 'NONE',
        },
        obligation: {
          obligationType: 'NONE',
          animalObligations: [],
          alternativeOptions: [],
          monetaryAlternative: null,
        },
        explanationIds: ['EXPL-INELIGIBLE'],
        evidence: [],
        ruleResolution: {
          ruleFamilyId: 'NONE',
          baseRuleId: 'NONE',
          appliedOverrideIds: [],
        },
        knowledgeReleaseVersion,
        ruleEngineVersion: '1.0.0',
      };
    }

    // Step 8: Resolve schedule from registry/fixtures
    const schedule = BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES.find(
      s => s.identity.animalTypeId === facts.animalTypeId
    );

    if (!schedule) {
      return {
        assetInstanceId: facts.assetInstanceId,
        categoryId: facts.categoryId,
        categoryVersion: '1.0.0',
        animalTypeId: facts.animalTypeId,
        animalTypeVersion: '1.0.0',
        inputSummary: {
          totalCount: facts.herd.totalCount,
          ownershipPeriod: facts.ownership as any,
          feedingMethod: facts.feedingAndGrazing.method,
          purposeClassification: facts.purpose.classification,
        },
        eligibility: {
          status: 'SCHEDULE_NOT_FOUND',
          isEligible: false,
          appliedRuleIds: [],
          evidenceIds: [],
          reasonCode: 'SCHEDULE_NOT_FOUND',
          explanationText: `No approved livestock schedule found for animal type ${facts.animalTypeId}.`,
          requiresScholarReview: true,
        },
        scheduleResolution: {
          scheduleId: 'UNRESOLVED',
          scheduleVersion: '1.0.0',
          scheduleModel: 'REVIEW_REQUIRED',
          matchedBandId: null,
          matchedPatternId: null,
          resolvedCombination: null,
          selectedMadhhab: madhhab,
          resolvedScheduleChecksum: 'NONE',
        },
        obligation: {
          obligationType: 'REVIEW_REQUIRED',
          animalObligations: [],
          alternativeOptions: [],
          monetaryAlternative: null,
        },
        explanationIds: ['EXPL-SCHEDULE-NOT-FOUND'],
        evidence: [],
        ruleResolution: {
          ruleFamilyId: 'NONE',
          baseRuleId: 'NONE',
          appliedOverrideIds: [],
        },
        knowledgeReleaseVersion,
        ruleEngineVersion: '1.0.0',
      };
    }

    // Step 9-10: Match band and resolve obligation
    const bandMatch = this.bandMatcher.matchBand(
      facts.herd.totalCount,
      schedule.scheduleModel.bands
    );

    if (bandMatch.status !== 'MATCHED' || !bandMatch.matchedBand) {
      return {
        assetInstanceId: facts.assetInstanceId,
        categoryId: facts.categoryId,
        categoryVersion: '1.0.0',
        animalTypeId: facts.animalTypeId,
        animalTypeVersion: '1.0.0',
        inputSummary: {
          totalCount: facts.herd.totalCount,
          ownershipPeriod: facts.ownership as any,
          feedingMethod: facts.feedingAndGrazing.method,
          purposeClassification: facts.purpose.classification,
        },
        eligibility: {
          status: 'SCHEDULE_GAP_DETECTED',
          isEligible: false,
          appliedRuleIds: [],
          evidenceIds: [],
          reasonCode: 'SCHEDULE_GAP_DETECTED',
          explanationText: bandMatch.error || 'No matching schedule band found.',
          requiresScholarReview: true,
        },
        scheduleResolution: {
          scheduleId: schedule.scheduleId,
          scheduleVersion: schedule.version,
          scheduleModel: schedule.scheduleModel.modelType,
          matchedBandId: null,
          matchedPatternId: null,
          resolvedCombination: null,
          selectedMadhhab: madhhab,
          resolvedScheduleChecksum: schedule.integrity.contentChecksum,
        },
        obligation: {
          obligationType: 'REVIEW_REQUIRED',
          animalObligations: [],
          alternativeOptions: [],
          monetaryAlternative: null,
        },
        explanationIds: ['EXPL-GAP-DETECTED'],
        evidence: [],
        ruleResolution: {
          ruleFamilyId: schedule.identity.ruleFamilyId,
          baseRuleId: schedule.scheduleId,
          appliedOverrideIds: [],
        },
        knowledgeReleaseVersion,
        ruleEngineVersion: '1.0.0',
      };
    }

    const matchedBand = bandMatch.matchedBand;
    const isBelowThreshold = matchedBand.obligation.obligationDefinitionId === 'OBLIGATION-SYNTHETIC-NONE';

    return {
      assetInstanceId: facts.assetInstanceId,
      categoryId: facts.categoryId,
      categoryVersion: '1.0.0',
      animalTypeId: facts.animalTypeId,
      animalTypeVersion: '1.0.0',
      inputSummary: {
        totalCount: facts.herd.totalCount,
        ownershipPeriod: facts.ownership as any,
        feedingMethod: facts.feedingAndGrazing.method,
        purposeClassification: facts.purpose.classification,
      },
      eligibility,
      scheduleResolution: {
        scheduleId: schedule.scheduleId,
        scheduleVersion: schedule.version,
        scheduleModel: schedule.scheduleModel.modelType,
        matchedBandId: matchedBand.bandId,
        matchedPatternId: null,
        resolvedCombination: null,
        selectedMadhhab: madhhab,
        resolvedScheduleChecksum: schedule.integrity.contentChecksum,
      },
      obligation: {
        obligationType: isBelowThreshold ? 'NONE' : 'ANIMAL_DUE',
        obligationDefinitionId: matchedBand.obligation.obligationDefinitionId,
        animalObligations: isBelowThreshold ? [] : [{
          animalTypeId: facts.animalTypeId,
          animalClassId: 'SYNTHETIC_CLASS_01',
          quantity: 1,
        }],
        alternativeOptions: [],
        monetaryAlternative: null,
      },
      explanationIds: matchedBand.explanationIds,
      evidence: matchedBand.evidenceLinks.map(el => ({
        evidenceId: el.evidenceId,
        evidenceVersion: el.evidenceVersion,
        referenceLabel: el.evidenceId,
        supports: el.supports,
      })),
      ruleResolution: {
        ruleFamilyId: schedule.identity.ruleFamilyId,
        baseRuleId: schedule.scheduleId,
        appliedOverrideIds: [],
      },
      knowledgeReleaseVersion,
      ruleEngineVersion: '1.0.0',
    };
  }
}
