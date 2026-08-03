import crypto from 'crypto';
import { prisma } from '../../../config/database';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface CreateTokenInput {
  navigationId: string;
  userScope: string;
  calculationId?: string | null;
  reportId?: string | null;
  expiresInSeconds?: number; // default 24h
  singleUse?: boolean;
  payloadChecksum: string;
}

export interface ResolveTokenResult {
  isValid: boolean;
  error?: string;
  navigationId?: string;
  userScope?: string;
  calculationId?: string | null;
  reportId?: string | null;
  payloadChecksum?: string;
}

export class EvidenceNavigationTokenService {
  /**
   * Generates an opaque, signed navigation token for deep links, QR codes, or PDF references.
   */
  static async createToken(input: CreateTokenInput): Promise<{ token: string; tokenId: string; expiresAt: Date }> {
    const tokenId = `TOK-${crypto.randomUUID()}`;
    const rawToken = `${tokenId}.${crypto.randomBytes(32).toString('hex')}`;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const duration = input.expiresInSeconds || 86400; // 24 hours default
    const expiresAt = new Date(Date.now() + duration * 1000);

    await (prisma as any).evidenceNavigationTokenDb.create({
      data: {
        token_id: tokenId,
        token_hash: tokenHash,
        navigation_id: input.navigationId,
        user_scope: input.userScope,
        calculation_id: input.calculationId || null,
        report_id: input.reportId || null,
        expires_at: expiresAt,
        single_use: input.singleUse || false,
        is_used: false,
        payload_checksum: input.payloadChecksum,
      },
    });

    return { token: rawToken, tokenId, expiresAt };
  }

  /**
   * Resolves and verifies an opaque navigation token.
   */
  static async resolveToken(rawToken: string): Promise<ResolveTokenResult> {
    if (!rawToken || !rawToken.includes('.')) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_EXPIRED' };
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const dbToken = await (prisma as any).evidenceNavigationTokenDb.findUnique({
      where: { token_hash: tokenHash },
    });

    if (!dbToken) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_EXPIRED' };
    }

    // Check revocation
    if (dbToken.revoked_at) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_REVOKED' };
    }

    // Check revocation DB table
    const revocation = await (prisma as any).evidenceNavigationTokenRevocationDb.findUnique({
      where: { token_id: dbToken.token_id },
    });
    if (revocation) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_REVOKED' };
    }

    // Check expiration
    if (new Date() > new Date(dbToken.expires_at)) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_EXPIRED' };
    }

    // Check single-use
    if (dbToken.single_use && dbToken.is_used) {
      return { isValid: false, error: 'NAVIGATION_TOKEN_EXPIRED' };
    }

    // Mark used if single-use
    if (dbToken.single_use) {
      await (prisma as any).evidenceNavigationTokenDb.update({
        where: { token_id: dbToken.token_id },
        data: { is_used: true },
      });
    }

    return {
      isValid: true,
      navigationId: dbToken.navigation_id,
      userScope: dbToken.user_scope,
      calculationId: dbToken.calculation_id,
      reportId: dbToken.report_id,
      payloadChecksum: dbToken.payload_checksum,
    };
  }

  /**
   * Revokes a token by token ID.
   */
  static async revokeToken(tokenId: string, revokedBy: string, reason: string): Promise<boolean> {
    const token = await (prisma as any).evidenceNavigationTokenDb.findUnique({ where: { token_id: tokenId } });
    if (!token) return false;

    await (prisma as any).evidenceNavigationTokenDb.update({
      where: { token_id: tokenId },
      data: { revoked_at: new Date() },
    });

    await (prisma as any).evidenceNavigationTokenRevocationDb.create({
      data: {
        token_id: tokenId,
        revoked_by: revokedBy,
        reason,
      },
    });

    return true;
  }
}
