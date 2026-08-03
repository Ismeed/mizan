import { prisma } from '../../../config/database';
import { AIEvidenceContextV2 } from '../../../../../packages/shared/src';
import { AIEvidenceContextSnapshotService } from './ai-evidence-context-snapshot.service';

export interface StartEvidenceConversationInput {
  userId: string;
  contextPayload: AIEvidenceContextV2;
}

export interface GeneratedOpeningMessage {
  title: string;
  evidenceReference: string;
  decisionSummary: string;
  relationshipSummary: string;
  selectedMadhhabLabel: string;
  sourceDisclosure: string;
  followUpSuggestions: string[];
}

export class AIEvidenceConversationService {
  /**
   * Initializes an evidence-explanation AI conversation with an immutable snapshot.
   */
  static async startConversation(input: StartEvidenceConversationInput) {
    // 1. Create immutable snapshot
    const snapshot = await AIEvidenceContextSnapshotService.createSnapshot(input.contextPayload);

    // 2. Create AI Conversation in DB
    const evRef = input.contextPayload.evidenceContext.canonicalReference || input.contextPayload.evidenceContext.evidenceId;
    const conversation = await prisma.aiConversation.create({
      data: {
        user_id: input.userId,
        title: `Evidence Explanation: ${evRef}`,
      },
    });

    // 3. Link conversation to snapshot
    await (prisma as any).aIEvidenceConversationLinkDb.create({
      data: {
        conversation_id: conversation.id,
        ai_context_snapshot_id: snapshot.aiContextSnapshotId,
      },
    });

    // 4. Generate structured opening message
    const openingMsg = this.generateOpeningMessage(input.contextPayload);

    // 5. Store opening assistant message in ai_messages table
    const formattedContent = `### ${openingMsg.title}\n\n**Reference:** ${openingMsg.evidenceReference}\n**Madhhab:** ${openingMsg.selectedMadhhabLabel}\n**Decision:** ${openingMsg.decisionSummary}\n\n${openingMsg.relationshipSummary}\n\n_${openingMsg.sourceDisclosure}_`;

    await prisma.aiMessage.create({
      data: {
        conversation_id: conversation.id,
        role: 'assistant',
        content: formattedContent,
        sources: JSON.stringify([
          {
            evidenceId: input.contextPayload.evidenceContext.evidenceId,
            reference: openingMsg.evidenceReference,
            supports: input.contextPayload.evidenceContext.supports,
          },
        ]),
      },
    });

    return {
      conversationId: conversation.id,
      aiContextSnapshotId: snapshot.aiContextSnapshotId,
      openingMessage: openingMsg,
    };
  }

  /**
   * Generates localized structured opening message from verified context.
   */
  private static generateOpeningMessage(context: AIEvidenceContextV2): GeneratedOpeningMessage {
    const ev = context.evidenceContext;
    const madhhab = context.calculationContext?.selectedMadhhab || 'HANAFI';
    const lang = context.calculationContext?.languageTag || 'en';

    const title = lang === 'ha' ? 'Bayanin Shaidar Addini' : 'Verified Evidence Explanation';
    const decisionSummary = context.decisionContext
      ? `Decision Code: ${context.decisionContext.decisionCode} (${context.decisionContext.status})`
      : 'Authoritative Evidence Record';

    const relationshipSummary = context.explanationContext?.approvedShortExplanation ||
      `This evidence record (${ev.evidenceType}) supports the ${ev.supports} aspect under the ${madhhab} school.`;

    const followUpSuggestions = [
      'Explain how this evidence supports the result.',
      'Explain this ruling in simpler language.',
      'Show the approved original Arabic text.',
      'Show the approved translation.',
      'Explain the selected madhhab’s approved position.',
    ];

    if (ev.supports === 'FRACTION') {
      followUpSuggestions.push('Explain the exact fraction.');
    } else if (ev.supports === 'COUNT_RANGE' || ev.supports === 'ANIMAL_CLASS') {
      followUpSuggestions.push('Explain the livestock schedule band.');
    } else if (ev.supports === 'IRRIGATION_CLASSIFICATION' || ev.supports === 'AGRICULTURE_RATE') {
      followUpSuggestions.push('Explain the agriculture irrigation classification.');
    }

    return {
      title,
      evidenceReference: ev.canonicalReference,
      decisionSummary,
      relationshipSummary,
      selectedMadhhabLabel: madhhab,
      sourceDisclosure: 'Source: MIZAN Verified Authoritative Knowledge Base (AI Commentary is strictly explanatory and does not alter the result).',
      followUpSuggestions,
    };
  }
}
