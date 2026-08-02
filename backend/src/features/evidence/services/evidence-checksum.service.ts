import crypto from 'crypto';
import { BaseEvidence } from '@mizan/shared';

export class EvidenceChecksumService {
  /**
   * Generates a deterministic SHA-256 checksum for evidence content object.
   */
  static generateContentChecksum(content: Record<string, any>): string {
    const canonicalJson = this.canonicalizeJson(content);
    return crypto.createHash('sha256').update(canonicalJson).digest('hex');
  }

  /**
   * Generates a SHA-256 checksum for a translation string.
   */
  static generateTranslationChecksum(text: string, languageTag: string): string {
    const payload = `${languageTag.toLowerCase()}:${text.trim()}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Generates a complete SHA-256 checksum for an entire BaseEvidence record.
   */
  static generateRecordChecksum(evidence: BaseEvidence): string {
    const keyFields = {
      evidenceId: evidence.evidenceId,
      version: evidence.version,
      evidenceType: evidence.evidenceType,
      madhhabScope: evidence.madhhabScope,
      content: evidence.content,
      translations: evidence.translations,
      citation: evidence.citation,
      sourceProvenance: evidence.sourceProvenance,
      licensing: evidence.licensing,
      schemaVersion: evidence.schemaVersion,
    };
    const canonicalJson = this.canonicalizeJson(keyFields);
    return crypto.createHash('sha256').update(canonicalJson).digest('hex');
  }

  /**
   * Recursively canonicalizes JSON by sorting keys alphabetically.
   */
  private static canonicalizeJson(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map((item) => this.canonicalizeJson(item)).join(',') + ']';
    }
    const sortedKeys = Object.keys(obj).sort();
    const parts = sortedKeys.map((key) => `${JSON.stringify(key)}:${this.canonicalizeJson(obj[key])}`);
    return '{' + parts.join(',') + '}';
  }
}
