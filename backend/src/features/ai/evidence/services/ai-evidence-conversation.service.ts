import { prisma } from '../../../../config/database';

export interface StartEvidenceConversationInput {
  userId: string;
  contextSnapshotId: string;
  evidenceId: string;
  selectedMadhhab: string;
  title?: string;
}

export class AIEvidenceConversationService {
  /**
   * Starts a multi-turn evidence conversation linked to an immutable Context Snapshot.
   */
  static async startConversation(input: StartEvidenceConversationInput) {
    const conversationId = 'CONVO-EVIDENCE-' + Math.random().toString(36).substring(2, 10);

    const convo = await prisma.aIEvidenceConversationDb.create({
      data: {
        conversation_id: conversationId,
        user_id: input.userId,
        ai_context_snapshot_id: input.contextSnapshotId,
        initial_evidence_id: input.evidenceId,
        selected_madhhab: input.selectedMadhhab,
        knowledge_release_ver: '1.0.0',
        title: input.title || `Evidence Clarification (${input.evidenceId})`,
        status: 'ACTIVE',
      },
    });

    return convo;
  }

  /**
   * Adds a turn to the evidence conversation.
   */
  static async recordTurn(
    conversationId: string,
    turnNumber: number,
    userQuestion: string,
    requestId: string,
    responseId: string,
    status: string
  ) {
    return prisma.aIEvidenceConversationTurnDb.create({
      data: {
        conversation_id: conversationId,
        turn_number: turnNumber,
        user_question: userQuestion,
        ai_request_id: requestId,
        ai_response_id: responseId,
        response_status: status,
      },
    });
  }
}
