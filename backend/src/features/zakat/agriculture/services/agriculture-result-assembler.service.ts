/**
 * MIZAN — Agriculture Result Assembler Service (Phase 10)
 */

import {
  AgricultureAssetResult,
  CanonicalAgricultureFacts,
  AgricultureEligibilityResult,
  AgricultureNisabRecord,
  AgricultureRateRecord,
  AgricultureObligationDefinition,
} from '@mizan/shared';

export class AgricultureResultAssemblerService {
  public assembleAssetResult(
    facts: CanonicalAgricultureFacts,
    eligibility: AgricultureEligibilityResult,
    nisabRecord: AgricultureNisabRecord | undefined,
    rateRecord: AgricultureRateRecord | undefined,
    obligation: AgricultureObligationDefinition,
    madhhab: string,
    knowledgeReleaseVersion: string = '1.0.0'
  ): AgricultureAssetResult {
    return {
      assetInstanceId: facts.assetInstanceId,
      categoryId: facts.categoryId,
      categoryVersion: '1.0.0',
      produceTypeId: facts.produceTypeId,
      produceTypeVersion: '1.0.0',
      inputSummary: {
        harvestQuantity: facts.harvest.quantity,
        quantityUnit: facts.harvest.quantityUnit,
        irrigationMethod: facts.irrigation.method,
        harvestDate: facts.harvest.harvestDate,
      },
      eligibility,
      nisabResolution: {
        nisabId: nisabRecord?.nisabId ?? 'UNRESOLVED',
        thresholdQuantity: nisabRecord?.thresholdQuantity ?? { numerator: 0n, denominator: 1n },
        unit: nisabRecord?.unit ?? facts.harvest.quantityUnit,
        isAboveNisab: eligibility.reasonCode !== 'BELOW_NISAB',
        selectedMadhhab: madhhab,
      },
      rateResolution: {
        rateId: rateRecord?.rateId ?? 'UNRESOLVED',
        appliedRate: rateRecord?.rate ?? { numerator: 0n, denominator: 1n },
        irrigationMethod: facts.irrigation.method,
      },
      obligation,
      explanationIds: ['EXPL-AGRI-RESOLUTION-COMPLETE'],
      evidence: [
        {
          evidenceId: 'EVID-AGRI-SUMMARY',
          evidenceVersion: '1.0.0',
          referenceLabel: 'Surah Al-An\'am 6:141',
          supports: 'OBLIGATION',
        },
      ],
      ruleResolution: {
        ruleFamilyId: 'RULE-FAM-AGRICULTURE',
        baseRuleId: nisabRecord?.nisabId ?? 'BASE-AGRI',
        appliedOverrideIds: [],
      },
      knowledgeReleaseVersion,
      ruleEngineVersion: '1.0.0',
    };
  }
}
