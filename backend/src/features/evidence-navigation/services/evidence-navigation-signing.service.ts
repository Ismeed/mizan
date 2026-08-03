import crypto from 'crypto';

export class EvidenceNavigationSigningService {
  private static readonly DEFAULT_SECRET = process.env.EVIDENCE_NAV_SIGNING_KEY || 'mizan-evidence-nav-secret-key-2026-sha256';

  /**
   * Generates a deterministic SHA-256 payload checksum.
   */
  static generatePayloadChecksum(payload: Record<string, any>): string {
    const canonicalJson = this.canonicalizeJson(payload);
    return crypto.createHash('sha256').update(canonicalJson).digest('hex');
  }

  /**
   * Generates an HMAC-SHA256 signature for a navigation payload or token.
   */
  static generateSignature(payloadChecksum: string, navigationId: string, secretKey: string = this.DEFAULT_SECRET): string {
    const data = `${navigationId}:${payloadChecksum}`;
    return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  }

  /**
   * Verifies an HMAC-SHA256 signature.
   */
  static verifySignature(
    payloadChecksum: string,
    navigationId: string,
    signature: string,
    secretKey: string = this.DEFAULT_SECRET
  ): boolean {
    const expectedSignature = this.generateSignature(payloadChecksum, navigationId, secretKey);
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
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
    const parts = sortedKeys
      .filter((k) => k !== 'security') // exclude security block when calculating payload checksum
      .map((key) => `${JSON.stringify(key)}:${this.canonicalizeJson(obj[key])}`);
    return '{' + parts.join(',') + '}';
  }
}
