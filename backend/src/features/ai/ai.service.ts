import { prisma } from '../../config/database';
import { GeminiProvider } from './providers/gemini.provider';
import { PromptGuard } from './security/prompt-guard';
import { RuleEngineGuard } from './security/rule-engine-guard';
import { DualRAGRetriever } from './rag/dual-rag.retriever';
import { PromptBuilder } from './prompt/prompt.builder';
import { CitationEngine } from './citation/citation.engine';

export interface AIChatInput {
  userId: string;
  content: string;
  conversationId?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  contextData?: any;
}

export interface AIChatResponse {
  content: string;
  conversationId: string;
  messageId: string;
  sources?: any[];
  madhhabPositions?: any;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  providerUsed: 'GEMINI' | 'FALLBACK_RAG';
}

export class AIService {
  private geminiProvider: GeminiProvider;

  constructor() {
    this.geminiProvider = new GeminiProvider();
  }

  async chat(input: AIChatInput): Promise<AIChatResponse> {
    const { userId, content, conversationId, history = [], contextData = {} } = input;

    const sanitizedPrompt = PromptGuard.sanitizeInput(content);

    if (PromptGuard.isAbusive(sanitizedPrompt)) {
      throw new Error('MALICIOUS_INPUT_DETECTED');
    }

    const calcContext = RuleEngineGuard.processCalculationGuard(sanitizedPrompt, contextData);
    const ragResult = DualRAGRetriever.retrieve(sanitizedPrompt);

    let conversation = conversationId
      ? await prisma.aiConversation.findUnique({ where: { id: conversationId } })
      : null;

    if (conversation && conversation.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    if (!conversation) {
      conversation = await prisma.aiConversation.create({
        data: {
          user_id: userId,
          title: sanitizedPrompt.slice(0, 60) + (sanitizedPrompt.length > 60 ? '…' : ''),
        },
      });
    }

    await prisma.aiMessage.create({
      data: {
        conversation_id: conversation.id,
        role: 'user',
        content: sanitizedPrompt,
      },
    });

    let responseText = '';
    let providerUsed: 'GEMINI' | 'FALLBACK_RAG' = 'GEMINI';

    const userContext = {
      madhhab: contextData.madhhab || 'HANAFI',
      currency: contextData.currency || 'NGN',
      language: contextData.language || 'English',
    };

    const { systemInstruction, userPayload } = PromptBuilder.buildPrompt(
      sanitizedPrompt,
      ragResult,
      calcContext,
      userContext,
      history
    );

    try {
      responseText = await this.geminiProvider.generateResponse(systemInstruction, userPayload);
    } catch (geminiErr) {
      console.warn('[AIService] Gemini API unavailable or key missing. Using verified Dual-RAG fallback:', geminiErr);
      providerUsed = 'FALLBACK_RAG';
      responseText = this.generateDualRAGFallbackResponse(sanitizedPrompt, ragResult, calcContext, userContext);
    }

    const allDocs = [...ragResult.islamicDocs, ...ragResult.appDocs];
    const citationData = CitationEngine.generateStructuredCitations(responseText, allDocs, userContext.madhhab);

    const savedMsg = await prisma.aiMessage.create({
      data: {
        conversation_id: conversation.id,
        role: 'assistant',
        content: responseText,
        sources: JSON.stringify(citationData.sources),
      },
    });

    return {
      content: responseText,
      conversationId: conversation.id,
      messageId: savedMsg.id,
      sources: citationData.sources,
      madhhabPositions: citationData.madhhabPositions,
      confidence: ragResult.overallConfidence,
      providerUsed,
    };
  }

  private generateDualRAGFallbackResponse(
    prompt: string,
    ragResult: any,
    calcContext: any,
    userContext: any
  ): string {
    const q = prompt.toLowerCase();

    if (ragResult.primaryContextType === 'APP_NAVIGATION' && ragResult.appDocs.length > 0) {
      const doc = ragResult.appDocs[0];
      return `**MIZAN App Feature Guide: ${doc.title}**\n\n${doc.description}\n\n**Navigation Steps:**\n${doc.navigationSteps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\n**Key Features:** ${doc.features.join(', ')}`;
    }

    if (calcContext.type !== 'NONE' && calcContext.engineOutput) {
      const out = calcContext.engineOutput;
      if (calcContext.type === 'MIRATH') {
        return `**Official Mirath Calculation Summary (Rule Engine Result)**\n\nNet Estate: **₦${out.netEstate.toLocaleString()}** (Madhhab: **${out.madhhab}**)\nCalculation Method: **${out.calculationMethod}**\n\n**Heir Distribution Breakdown:**\n${out.shares.map((s: any) => `• ${s.label}: ${s.fractionLabel} = ₦${s.totalAmount.toLocaleString()} (${(s.shareOfEstate * 100).toFixed(2)}%)`).join('\n')}\n\n*Reference: Quran (Surah An-Nisa 4:11-12)*`;
      }
      if (calcContext.type === 'ZAKAT') {
        return `**Official Zakat Calculation Summary (Rule Engine Result)**\n\nTotal Zakatable Assets: **₦${out.totalZakatableWealth.toLocaleString()}**\nNet Zakatable Base: **₦${out.netZakatableWealth.toLocaleString()}**\nNisab Required: **₦${out.nisabThreshold.toLocaleString()}**\n\n**Zakat Payable (2.5%): ₦${out.zakatDue.toLocaleString()}**\n\n*Reference: Quran (Surah At-Tawbah 9:60, 9:103)*`;
      }
    }

    if (ragResult.islamicDocs.length > 0) {
      const topDoc = ragResult.islamicDocs[0];
      return `Assalamu Alaikum!\n\nRegarding your question on **"${prompt}"**:\n\n**${topDoc.reference}:**\n"${topDoc.translationText}"\n\nIn Shariah Fiqh, all financial matters are evaluated based on Quranic text, authentic Sunnah, and consensus across Hanafi, Maliki, Shafi'i, Hanbali, and Ja'fari madhhabs.`;
    }

    return `Assalamu Alaikum! I am MIZAN's AI Assistant. You can ask me specific questions about Zakat, Inheritance (Mirath), Wasiyyah, Halal Investments, or ask me how to navigate any screen in the MIZAN app.`;
  }

  async getConversations(userId: string) {
    return prisma.aiConversation.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
      take: 30,
      select: { id: true, title: true, created_at: true, updated_at: true },
    });
  }

  /**
   * Retrieve messages for a conversation (enforces 403 Forbidden ownership check).
   */
  async getMessages(conversationId: string, userId: string) {
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!conversation) {
      const err = new Error('Conversation not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (conversation.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    return conversation.messages;
  }

  /**
   * Delete a conversation (enforces 403 Forbidden ownership check).
   */
  async deleteConversation(conversationId: string, userId: string) {
    const convo = await prisma.aiConversation.findUnique({ where: { id: conversationId } });

    if (!convo) {
      const err = new Error('Conversation not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (convo.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    await prisma.aiMessage.deleteMany({ where: { conversation_id: conversationId } });
    return prisma.aiConversation.delete({ where: { id: conversationId } });
  }
}
