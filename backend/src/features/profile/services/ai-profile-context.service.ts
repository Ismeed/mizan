import { CalculationProfileSnapshotService } from './calculation-profile-snapshot.service';

export class AIProfileContextService {
  /**
   * Generates structured AI context from a frozen calculation profile snapshot.
   */
  static async buildAIContext(calculationId: string) {
    const snapshot = await CalculationProfileSnapshotService.getSnapshotByCalculationId(calculationId);

    if (!snapshot) {
      return null;
    }

    return {
      calculationId: snapshot.calculation_id,
      calculationProfile: {
        madhhab: snapshot.madhhab,
        currencyCode: snapshot.currency_code,
        currencySymbol: snapshot.currency_symbol_snapshot,
        languageTag: snapshot.language_tag,
        knowledgeReleaseVersion: snapshot.knowledge_release_version,
        ruleEngineVersion: snapshot.rule_engine_version,
      },
      restrictions: {
        mustNotChangeMadhhab: true,
        mustNotRecalculate: true,
        mustNotInventRules: true,
        mustUseApprovedEvidence: true,
      },
    };
  }
}
