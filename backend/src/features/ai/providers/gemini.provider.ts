import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../../config';

export class GeminiProvider {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = config.gemini.apiKey || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('[GeminiProvider] Warning: GEMINI_API_KEY is not set. Gemini API calls will fall back to local RAG engine.');
    }
  }

  /**
   * Generates a response using Google Gemini 1.5 Pro / Flash models.
   */
  async generateResponse(systemInstruction: string, userPrompt: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('GEMINI_API_KEY_MISSING');
    }

    // Use gemini-1.5-pro or fallback model
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction,
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  }
}
