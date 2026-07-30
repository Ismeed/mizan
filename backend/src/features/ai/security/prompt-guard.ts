export class PromptGuard {
  /**
   * Sanitizes input text against prompt injection attacks and malicious overrides.
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';

    // Remove common prompt injection patterns
    let sanitized = input
      .replace(/ignore (all )?previous (instructions|prompts)/gi, '[blocked]')
      .replace(/you are now system/gi, '[blocked]')
      .replace(/system:\s*/gi, '')
      .replace(/override system prompt/gi, '[blocked]');

    // Strip sensitive raw credentials or tokens if pasted accidentally
    sanitized = sanitized.replace(/(sk-[a-zA-Z0-9]{20,})|(MOCK_KEY_[a-zA-Z0-9_-]{20,})/g, '[REDACTED_KEY]');

    return sanitized.trim();
  }

  /**
   * Redacts PII (Emails, Phone numbers, credit cards) before sending to LLM.
   */
  static redactPII(text: string): string {
    if (!text) return '';
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[USER_EMAIL]')
      .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[USER_PHONE]');
  }

  /**
   * Checks for abusive repetitive requests or malicious keywords.
   */
  static isAbusive(prompt: string): boolean {
    const p = prompt.toLowerCase();
    const malicious = ['drop database', 'exec(', 'system.exit', '<script>', 'eval('];
    return malicious.some(m => p.includes(m));
  }
}
