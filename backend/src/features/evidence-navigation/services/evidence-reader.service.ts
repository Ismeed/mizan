import { prisma } from '../../../config/database';
import { BaseEvidence } from '../../../../../packages/shared/src';
import { EvidenceRegistryService } from '../../evidence/services/evidence-registry.service';
import { EvidenceCitationService } from '../../evidence/services/evidence-citation.service';

export interface OpenReaderInput {
  evidenceId: string;
  version?: string;
  madhhab: string;
  languageTag: string;
  userId?: string | null;
}

export interface EvidenceReaderContent {
  sessionId: string;
  evidence: BaseEvidence;
  citation: {
    short: string;
    full: string;
    direction: 'LTR' | 'RTL';
  };
  formattedContent: {
    originalText?: string;
    approvedTranslation?: string;
    attributionText?: string;
    madhhabScope: string[];
    topics: string[];
    canonicalReference: string;
  };
  supportedRulings: any[];
  relatedRules: any[];
  availableActions: string[];
}

export class EvidenceReaderService {
  /**
   * Loads authoritative evidence content for the Evidence Reader UI.
   */
  static async openReaderSession(input: OpenReaderInput): Promise<EvidenceReaderContent | null> {
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

    const sessionId = `SESSION-${input.evidenceId}-${Date.now()}`;

    // Record session
    try {
      await (prisma as any).evidenceReaderSessionDb.create({
        data: {
          session_id: sessionId,
          user_id: input.userId || null,
          evidence_id: evidence.evidenceId,
          evidence_version: evidence.version,
          selected_madhhab: input.madhhab,
          language_tag: input.languageTag,
        },
      });
    } catch {
      // ignore log error
    }

    return {
      sessionId,
      evidence,
      citation: {
        short: citation.reference.short,
        full: citation.reference.full,
        direction: citation.formatting.direction === 'RTL' ? 'RTL' : 'LTR',
      },
      formattedContent: {
        originalText: citation.content.originalText,
        approvedTranslation: citation.content.approvedTranslation,
        attributionText: citation.content.attributionText,
        madhhabScope: evidence.madhhabScope?.appliesTo || [],
        topics: evidence.identity?.topics || [],
        canonicalReference: citation.reference.full,
      },
      supportedRulings: [],
      relatedRules: [],
      availableActions: ['ASK_MIZAN_AI', 'COPY_APPROVED_CITATION', 'RETURN_TO_RESULT'],
    };
  }
}
