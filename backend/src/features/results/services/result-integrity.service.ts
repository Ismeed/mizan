/**
 * MIZAN — Result Integrity Service (Phase 13)
 * Generates and verifies SHA-256 checksums using canonical serialization.
 */

import crypto from 'crypto';

export class ResultIntegrityService {
  /**
   * Generates a deterministic SHA-256 checksum from any JSON-serializable object.
   */
  static generateChecksum(data: unknown): string {
    const canonicalJson = this.canonicalStringify(data);
    return crypto.createHash('sha256').update(canonicalJson).digest('hex');
  }

  /**
   * Verifies that the provided data matches the expected SHA-256 checksum.
   */
  static verifyChecksum(data: unknown, expectedChecksum: string): boolean {
    const actual = this.generateChecksum(data);
    return actual === expectedChecksum;
  }

  private static canonicalStringify(obj: unknown): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map((item) => this.canonicalStringify(item)).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    const keyPairs = keys.map((key) => {
      const val = (obj as Record<string, unknown>)[key];
      return JSON.stringify(key) + ':' + this.canonicalStringify(val);
    });
    return '{' + keyPairs.join(',') + '}';
  }
}
