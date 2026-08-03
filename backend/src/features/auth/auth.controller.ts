import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

const service = new AuthService();

export class AuthController {

  // ── New passwordless endpoints ────────────────────────────────────────────

  /** POST /auth/email-otp/request — send OTP to email */
  async emailOtpRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.emailOtpRequest(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  /** POST /auth/email-otp/verify — verify OTP, return session */
  async emailOtpVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.emailOtpVerify(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  /** POST /auth/google — authenticate via Google token */
  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { googleId, email, name, profilePic } = req.body;
      if (!googleId || !email || !name) {
        return sendError(res, 'googleId, email, and name are required', 400);
      }
      const result = await service.googleAuth({ googleId, email, name, profilePic });
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  /** POST /auth/onboarding — save language, madhhab, currency preferences */
  async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const result = await service.completeOnboarding(userId, req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  /** PATCH /auth/name — update display name */
  async updateName(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const result = await service.updateName(userId, req.body.name);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  // ── Legacy endpoints (kept for backward compat) ──────────────────────────

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.register(req.body);
      sendSuccess(res, result, 201);
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.login(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.verifyEmail(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.resendVerificationEmail(req.body.email);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.requestPasswordReset(req.body.email);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.resetPassword(req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId       = (req as any).user.userId;
      // refreshAuthMiddleware already validated this token and attached it
      const oldRefresh   = (req as any).refreshToken as string | undefined;
      const result       = await service.refreshToken(userId, oldRefresh);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const result = await service.getProfile(userId);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const result = await service.updateProfile(userId, req.body);
      sendSuccess(res, result);
    } catch (error: any) {
      next(error);
    }
  }
}
