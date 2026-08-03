import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken, verifyRefreshToken } from '../utils/jwt.utils';
import { prisma } from '../../config/database';
import { sendError } from '../utils/response.utils';

// ── Access token middleware ───────────────────────────────────────────────────

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized: Access token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    let userId: string | null = null;
    let email: string | null = null;

    // 1. Attempt legacy JWT verification
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        userId = decoded.userId;
      }
    } catch {
      // Legacy verification failed — check if it's a Supabase JWT
    }

    // 2. If legacy failed, check for Supabase JWT structure
    if (!userId) {
      try {
        const decodedSupabase = jwt.decode(token) as any;
        if (decodedSupabase && (decodedSupabase.aud === 'authenticated' || decodedSupabase.sub)) {
          // Check expiration
          const now = Math.floor(Date.now() / 1000);
          if (decodedSupabase.exp && decodedSupabase.exp < now) {
            return sendError(res, 'Unauthorized: Supabase token expired', 401);
          }

          userId = decodedSupabase.sub;
          email = decodedSupabase.email ?? null;
        }
      } catch {
        // Not a valid JWT
      }
    }

    if (!userId) {
      return sendError(res, 'Unauthorized: Invalid or expired token', 401);
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user && email) {
      // Try finding by email
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      // Auto-provision shadow user record in Express DB if authenticated via Supabase
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: email ?? `${userId}@supabase.user`,
            name: email?.split('@')[0] ?? 'MIZAN User',
            onboardingCompleted: true,
          },
        });
      } catch {
        // Fallback: dummy user object attached to request if DB insert fails
        user = {
          id: userId,
          email: email ?? `${userId}@supabase.user`,
          name: 'MIZAN User',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      }
    }

    (req as any).user = {
      ...user,
      userId: user.id,
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', 401);
  }
};

// ── Refresh token middleware ───────────────────────────────────────────────────
/**
 * Used ONLY for POST /auth/refresh.
 * Reads and verifies the REFRESH token from the Authorization header.
 * The client sends: Authorization: Bearer <refresh_token>
 *
 * This is separate from authenticate() because:
 * - The access token may be expired when a refresh is needed
 * - We must validate the refresh token against a different JWT secret
 * - We also verify the refresh token exists in the UserSession table
 */
export const refreshAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized: Refresh token missing', 401);
    }

    const refreshToken = authHeader.split(' ')[1];

    // Verify JWT signature + expiry
    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return sendError(res, 'Unauthorized: Invalid or expired refresh token', 401);
    }

    if (!decoded?.userId) {
      return sendError(res, 'Unauthorized: Malformed refresh token', 401);
    }

    // Verify this refresh token exists in the database (not revoked)
    const session = await prisma.userSession.findFirst({
      where: { refresh_token: refreshToken },
    });

    if (!session) {
      return sendError(res, 'Session not found or already revoked', 401);
    }

    // Check session expiry
    if (session.expires_at < new Date()) {
      // Clean up expired session
      await prisma.userSession.deleteMany({ where: { refresh_token: refreshToken } }).catch(() => {});
      return sendError(res, 'Refresh token has expired. Please sign in again.', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return sendError(res, 'Account not found.', 401);
    }

    // Attach user + refresh token to request for controller use
    (req as any).user = {
      ...user,
      userId: user.id,
    };
    (req as any).refreshToken = refreshToken;

    next();
  } catch (error) {
    return sendError(res, 'Refresh authentication failed', 401);
  }
};

export const authMiddleware    = authenticate;
export const authenticateToken = authenticate;
export const refreshAuthMiddleware = refreshAuthenticate;
