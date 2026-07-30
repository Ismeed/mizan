import { DualRAGResult } from '../rag/dual-rag.retriever';
import { CalculationContext } from '../security/rule-engine-guard';

export interface UserContext {
  madhhab?: string;
  language?: string;
  country?: string;
  currency?: string;
}

export class PromptBuilder {
  /**
   * Constructs the full system prompt and user query payload for Gemini.
   */
  static buildPrompt(
    userPrompt: string,
    ragResult: DualRAGResult,
    calcContext: CalculationContext,
    userContext?: UserContext,
    history: any[] = []
  ): { systemInstruction: string; userPayload: string } {
    const madhhab = userContext?.madhhab || 'HANAFI';
    const currency = userContext?.currency || 'NGN';
    const language = userContext?.language || 'English';

    const systemInstruction = `You are MIZAN's AI Assistant — an enterprise-grade Islamic Finance Scholar and In-App Guide.

CORE MANDATE & RULES:
1. RULE ENGINE ISOLATION: NEVER calculate Zakat, Mirath, or monetary estate allocations yourself. The @mizan/shared Rule Engine is the ONLY source of truth. When Rule Engine output is provided in context, explain it mathematically and contextually to the user.
2. CITATION REQUIREMENT: Quote exact Quranic verses (Arabic + Translation when helpful), authentic Hadiths (Bukhari, Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i), and specific Madhhab positions (${madhhab}, Hanafi, Maliki, Shafi'i, Hanbali, Ja'fari).
3. APP NAVIGATION: When users ask how to use MIZAN or where to find features, give clear step-by-step navigation instructions using screen paths, tabs, and buttons.
4. SCHOLARLY DISAGREEMENT: Never hide differences of opinion among Madhhabs. Present them respectfully and clearly.
5. NO HALLUCINATION: Never invent Quranic verses, Hadiths, or Fiqh rulings. State uncertainty if evidence is not in context.
6. RESPOND IN USER LANGUAGE: Primary language: ${language}.`;

    // Construct RAG Context string
    let ragContextStr = '\n=== RETRIEVED ISLAMIC KNOWLEDGE BASE ===\n';
    ragResult.islamicDocs.forEach(d => {
      ragContextStr += `- [${d.source}] ${d.reference}: "${d.translationText}"\n`;
    });

    ragContextStr += '\n=== RETRIEVED APP NAVIGATION KNOWLEDGE BASE ===\n';
    ragResult.appDocs.forEach(a => {
      ragContextStr += `- [${a.title}] (${a.screenPath}) -> ${a.description}. Steps: ${a.navigationSteps.join(' > ')}\n`;
    });

    // Construct Rule Engine Output string if available
    let calcStr = '';
    if (calcContext.type !== 'NONE' && calcContext.engineOutput) {
      calcStr = `\n=== EXCLUSIVE RULE ENGINE OUTPUT (OFFICIAL RESULTS) ===\n${JSON.stringify(calcContext.engineOutput, null, 2)}\nExplain these exact numbers to the user without altering any mathematical values.\n`;
    }

    const userPayload = `
User Profile:
- Selected Madhhab: ${madhhab}
- Preferred Currency: ${currency}
- Language: ${language}

Recent Conversation History:
${history.slice(-6).map(h => `${h.role}: ${h.content}`).join('\n')}

${ragContextStr}
${calcStr}

User Query:
"${userPrompt}"
`;

    return { systemInstruction, userPayload };
  }
}
