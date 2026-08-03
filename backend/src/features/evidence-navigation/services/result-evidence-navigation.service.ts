import { prisma } from '../../../config/database';
import { ResultEvidenceNavigationPayload, EvidenceSupportsCategory } from '../../../../../packages/shared/src';
import { EvidenceNavigationBuilderService, BuildResultItemPayloadInput } from './evidence-navigation-builder.service';

export class ResultEvidenceNavigationService {
  /**
   * Registers a Result Item to Evidence Navigation link in the database and returns the payload.
   */
  static async linkAndBuildPayload(input: BuildResultItemPayloadInput): Promise<ResultEvidenceNavigationPayload> {
    const payload = EvidenceNavigationBuilderService.buildResultItemPayload(input);

    try {
      await (prisma as any).resultEvidenceNavigationLinkDb.upsert({
        where: { link_id: input.resultEvidenceLinkId },
        create: {
          link_id: input.resultEvidenceLinkId,
          result_id: input.resultId,
          result_item_id: input.resultItemId,
          rule_id: input.ruleId,
          rule_version: input.ruleVersion,
          evidence_id: input.evidenceId,
          evidence_version: input.evidenceVersion,
          supports_category: input.supports,
          madhhab_scope_json: { appliesTo: [input.selectedMadhhab] },
        },
        update: {
          supports_category: input.supports,
          madhhab_scope_json: { appliesTo: [input.selectedMadhhab] },
        },
      });
    } catch (err) {
      console.warn('[ResultEvidenceNavigationService] Link DB save warning:', err);
    }

    return payload;
  }
}
