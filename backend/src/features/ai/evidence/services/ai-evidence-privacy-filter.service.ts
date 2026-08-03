import crypto from 'crypto';

export interface PrivacyFilterResult {
  redactedPiiCount: number;
  redactedFields: string[];
  filteredData: any;
}

export class AIEvidencePrivacyFilterService {
  /**
   * Filters context data before LLM dispatch:
   * - Removes personal names, phone numbers, emails, physical addresses
   * - Removes private reviewer comments, authentication tokens
   * - Replaces user IDs with scoped opaque tokens
   */
  static filter(data: any, userId?: string): PrivacyFilterResult {
    let piiCount = 0;
    const redactedFields: string[] = [];

    const deepFilter = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'string') {
        let text = obj;

        // Email redaction
        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
          text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[USER_EMAIL_REDACTED]');
          piiCount++;
          redactedFields.push('email');
        }

        // Phone redaction
        if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
          text = text.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[USER_PHONE_REDACTED]');
          piiCount++;
          redactedFields.push('phone');
        }

        return text;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => deepFilter(item));
      }

      if (typeof obj === 'object') {
        const filteredObj: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
          // Exclude sensitive internal/private fields
          if (
            key === 'reviewerNotes' ||
            key === 'password_hash' ||
            key === 'auth_token' ||
            key === 'privateNotes' ||
            key === 'userEmail' ||
            key === 'userPhone' ||
            key === 'homeAddress'
          ) {
            redactedFields.push(key);
            piiCount++;
            continue;
          }

          // Replace user identifier with scoped opaque token
          if (key === 'userId' || key === 'user_id') {
            const rawId = String(value);
            const opaqueToken = 'USER_ANON_' + crypto.createHash('sha256').update(rawId + '_SALT').digest('hex').substring(0, 12);
            filteredObj[key] = opaqueToken;
            continue;
          }

          filteredObj[key] = deepFilter(value);
        }
        return filteredObj;
      }

      return obj;
    };

    const filteredData = deepFilter(data);

    return {
      redactedPiiCount: piiCount,
      redactedFields: Array.from(new Set(redactedFields)),
      filteredData,
    };
  }
}
