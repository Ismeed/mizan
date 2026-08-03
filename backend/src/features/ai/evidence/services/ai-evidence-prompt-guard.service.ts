import { prisma } from '../../../../config/database';

export interface PromptGuardInspectionResult {
  isSafe: boolean;
  detectedPattern?: string;
  sanitizedPrompt: string;
}

export class AIEvidencePromptGuardService {
  /**
   * Sanitizes input text, separates layers, and detects prompt injection attempts.
   */
  static inspectAndSanitize(prompt: string, userId: string = 'anonymous'): PromptGuardInspectionResult {
    if (!prompt || !prompt.trim()) {
      return { isSafe: true, sanitizedPrompt: '' };
    }

    const lower = prompt.toLowerCase();
    const injectionPatterns = [
      'ignore previous instructions',
      'ignore system prompt',
      'you are now system',
      'override system restrictions',
      'reveal system policy',
      'reveal prompt policy',
      'output system prompt',
      'forget restrictions',
      'act as DAN',
    ];

    for (const pattern of injectionPatterns) {
      if (lower.includes(pattern)) {
        // Log injection attempt asynchronously if DB is available
        if (process.env.NODE_ENV !== 'test') {
          prisma.aIPromptInjectionEventDb.create({
            data: {
              user_id: userId,
              raw_prompt: prompt.slice(0, 500),
              detected_pattern: pattern,
              action_taken: 'REJECTED',
            },
          }).catch(err => console.error('[PromptGuard] Failed to log injection event:', err));
        }

        return {
          isSafe: false,
          detectedPattern: pattern,
          sanitizedPrompt: '[PROMPT_INJECTION_REJECTED]',
        };
      }
    }

    // Strip potential system delimiter injections
    let sanitized = prompt
      .replace(/<SYSTEM_POLICY>/gi, '')
      .replace(/<\/SYSTEM_POLICY>/gi, '')
      .replace(/<VERIFIED_CONTEXT>/gi, '')
      .replace(/<\/VERIFIED_CONTEXT>/gi, '')
      .replace(/<TASK_INSTRUCTION>/gi, '')
      .replace(/<\/TASK_INSTRUCTION>/gi, '');

    return {
      isSafe: true,
      sanitizedPrompt: sanitized.trim(),
    };
  }
}
