import Joi from 'joi';

// ── Existing schemas (kept for backward compat) ────────────────────────────
export const registerSchema = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(128).optional(),
  name:     Joi.string().min(2).max(100).required(),
  phone:    Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional()
    .messages({ 'string.pattern.base': 'Phone must be a valid international number (e.g. +234...)' }),
});

export const loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().optional(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  otp:   Joi.string().length(6).pattern(/^\d{6}$/).required()
    .messages({ 'string.pattern.base': 'OTP must be a 6-digit number' }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

export const resetPasswordSchema = Joi.object({
  email:       Joi.string().email().lowercase().required(),
  otp:         Joi.string().length(6).pattern(/^\d{6}$/).required(),
  newPassword: Joi.string().min(8).max(128).optional(),
});

export const updateProfileSchema = Joi.object({
  name:     Joi.string().min(2).max(100).optional(),
  phone:    Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().allow(''),
  country:  Joi.string().length(2).uppercase().optional(),
  currency: Joi.string().length(3).uppercase().optional(),
  madhhab:  Joi.string().valid('HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI').optional(),
});

// ── New passwordless schemas ───────────────────────────────────────────────

/** Step 1: Request email OTP (creates/finds account) */
export const emailOtpRequestSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  name:  Joi.string().min(2).max(100).optional(),
});

/** Step 2: Verify email OTP (completes sign-in) */
export const emailOtpVerifySchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  otp:   Joi.string().length(6).pattern(/^\d{6}$/).required()
    .messages({ 'string.pattern.base': 'OTP must be a 6-digit number' }),
});

/** Google Sign-In: verify idToken from Google */
export const googleAuthSchema = Joi.object({
  idToken:    Joi.string().required(),
  name:       Joi.string().min(2).max(100).optional(),
  email:      Joi.string().email().optional(),
  profilePic: Joi.string().uri().optional(),
});

/** Onboarding preferences */
export const onboardingSchema = Joi.object({
  language:      Joi.string().valid('en', 'ar', 'ha', 'fr', 'sw').optional(),
  madhhab:       Joi.string().valid('HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI').optional(),
  currency:      Joi.string().length(3).uppercase().optional(),
  notifications: Joi.boolean().optional(),
});

/** Update display name only */
export const updateNameSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});
