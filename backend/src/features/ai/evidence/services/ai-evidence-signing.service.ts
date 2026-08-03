import crypto from 'crypto';

export class AIEvidenceSigningService {
  /**
   * Generates a deterministic SHA-256 checksum for any JSON-serializable object or string.
   * Strips transient self-referential `contextChecksum` to guarantee idempotency.
   */
  static generateChecksum(data: any): string {
    if (data === null || data === undefined) {
      return crypto.createHash('sha256').update('').digest('hex');
    }
    if (typeof data !== 'object') {
      return crypto.createHash('sha256').update(String(data)).digest('hex');
    }

    const clone = JSON.parse(JSON.stringify(data));
    if (clone.integrity && typeof clone.integrity === 'object') {
      clone.integrity.contextChecksum = '';
    }

    const canonicalStr = JSON.stringify(clone, Object.keys(clone).sort());
    return crypto.createHash('sha256').update(canonicalStr).digest('hex');
  }

  /**
   * Verifies that the provided checksum matches the data.
   */
  static verifyChecksum(data: any, expectedChecksum: string): boolean {
    const actualChecksum = this.generateChecksum(data);
    return actualChecksum === expectedChecksum;
  }
}
