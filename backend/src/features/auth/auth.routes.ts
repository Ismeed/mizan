import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../shared/middleware/validate.middleware';
import { authLimiter } from '../../shared/middleware/rate-limit.middleware';
import { authMiddleware, refreshAuthMiddleware } from '../../shared/middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  emailOtpRequestSchema,
  emailOtpVerifySchema,
  googleAuthSchema,
  onboardingSchema,
  updateNameSchema,
} from './auth.validators';

const router = Router();
const controller = new AuthController();

// ── Passwordless Email OTP (new primary auth) ─────────────────────────────
router.post('/email-otp/request', authLimiter, validateRequest(emailOtpRequestSchema), controller.emailOtpRequest.bind(controller));
router.post('/email-otp/verify',  authLimiter, validateRequest(emailOtpVerifySchema),  controller.emailOtpVerify.bind(controller));

// ── Google Sign-In ────────────────────────────────────────────────────────
router.post('/google', authLimiter, validateRequest(googleAuthSchema), controller.googleAuth.bind(controller));

// ── Protected: onboarding + name update ──────────────────────────────────
router.post('/onboarding', authMiddleware, validateRequest(onboardingSchema), controller.completeOnboarding.bind(controller));
router.patch('/name',      authMiddleware, validateRequest(updateNameSchema), controller.updateName.bind(controller));

// ── Legacy public routes (kept for backward compat) ──────────────────────
router.post('/register',            authLimiter, validateRequest(registerSchema),       controller.register.bind(controller));
router.post('/login',               authLimiter, validateRequest(loginSchema),          controller.login.bind(controller));
router.post('/verify-email',        authLimiter, validateRequest(verifyEmailSchema),    controller.verifyEmail.bind(controller));
router.post('/resend-verification', authLimiter, (req, res, next) => controller.resendVerification(req, res, next));
router.post('/forgot-password',     authLimiter, validateRequest(forgotPasswordSchema), controller.forgotPassword.bind(controller));
router.post('/reset-password',      authLimiter, validateRequest(resetPasswordSchema),  controller.resetPassword.bind(controller));

// ── Protected routes ──────────────────────────────────────────────────────────
// /refresh uses refreshAuthMiddleware (validates refresh token, not expired access token)
router.post('/refresh',  refreshAuthMiddleware, controller.refreshToken.bind(controller));
router.get('/profile',   authMiddleware, controller.getProfile.bind(controller));
router.patch('/profile', authMiddleware, validateRequest(updateProfileSchema), controller.updateProfile.bind(controller));

export { router as authRouter };
export default router;
