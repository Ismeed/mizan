import { EvidencePreviewContract, EvidenceSupportsCategory } from '../../../../../packages/shared/src';
import { EvidenceRegistryService } from '../../evidence/services/evidence-registry.service';
import { EvidenceCitationService } from '../../evidence/services/evidence-citation.service';

export interface GetPreviewInput {
  evidenceId: string;
  version?: string;
  madhhab: string;
  languageTag: string;
  navigationId?: string;
  supportsCategory?: EvidenceSupportsCategory;
  relatedDecisionSummary?: string;
}

export class EvidencePreviewService {
  /**
   * Builds an authoritative, server-resolved evidence preview contract for client UI components.
   */
  static async getPreview(input: GetPreviewInput): Promise<EvidencePreviewContract | null> {
    const evidence = await EvidenceRegistryService.getEvidenceById({
      evidenceId: input.evidenceId,
      version: input.version,
      madhhab: input.madhhab,
      languageTag: input.languageTag,
    });

    if (!evidence) {
      return null;
    }

    const citation = EvidenceCitationService.formatCitation(
      evidence,
      input.languageTag,
      input.madhhab
    );

    const approvedTextPreview =
      citation.content.approvedTranslation ||
      citation.content.originalText ||
      citation.reference.full;

    const navId = input.navigationId || `PREVIEW-${input.evidenceId}-${Date.now()}`;

    return {
      navigationId: navId,
      evidencePreview: {
        evidenceId: evidence.evidenceId,
        evidenceVersion: evidence.version,
        evidenceType: evidence.evidenceType,
        citation: {
          short: citation.reference.short,
          full: citation.reference.full,
          languageTag: input.languageTag,
          direction: citation.formatting.direction === 'RTL' ? 'RTL' : 'LTR',
        },
        approvedTextPreview,
        supports: input.supportsCategory || EvidenceSupportsCategory.DECISION,
        relatedDecisionSummary: input.relatedDecisionSummary || 'Authoritative evidence supporting this financial decision',
        selectedMadhhab: input.madhhab.toUpperCase(),
        approvedExplanationPreview: evidence.identity?.topics?.join(', '),
        availableActions: ['OPEN_EVIDENCE_READER', 'OPEN_AI_EVIDENCE'],
      },
    };
  }
}
