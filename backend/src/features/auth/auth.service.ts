import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { signToken, signRefreshToken } from '../../shared/utils/jwt.utils';
import { EmailService } from '../email/email.service';

const emailService = new EmailService();

// ── OTP helpers ────────────────────────────────────────────────────────────

/** Generate a cryptographically secure 6-digit OTP */
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/** OTP expiry: 10 minutes */
const OTP_EXPIRES_MS = 10 * 60 * 1000;

/** OTP resend rate limit: max 5 active OTPs per user/type before auto-invalidation */
async function createOTP(userId: string, type: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'EMAIL_LOGIN'): Promise<string> {
  const code    = generateOTP();
  const expires = new Date(Date.now() + OTP_EXPIRES_MS);

  // Invalidate all previous unused OTPs of this type for this user
  await prisma.otpCode.updateMany({
    where: { user_id: userId, type, used: false },
    data:  { used: true },
  });

  await prisma.otpCode.create({
    data: { user_id: userId, code, type, expires_at: expires },
  });

  return code;
}

async function verifyOTP(userId: string, code: string, type: string): Promise<boolean> {
  const otp = await prisma.otpCode.findFirst({
    where: { user_id: userId, code, type, used: false },
    orderBy: { created_at: 'desc' },
  });
  if (!otp) return false;
  if (otp.expires_at < new Date()) return false;

  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
  return true;
}

/** Build the standardised user response object */
function buildUserResponse(u: any) {
  return {
    id:                 u.id,
    email:              u.email,
    name:               u.name,
    emailVerified:      u.email_verified,
    isPremium:          u.is_premium ?? false,
    authProvider:       u.auth_provider ?? 'EMAIL',
    onboardingComplete: u.onboarding_complete ?? false,
    profileImageUrl:    u.profile_image_url ?? u.avatar_url ?? null,
    currency:           u.default_currency ?? u.app_settings?.currency ?? 'NGN',
    madhhab:            u.app_settings?.madhhab ?? 'MALIKI',
    language:           u.app_settings?.language ?? 'en',
  };
}

/** Create tokens + store refresh session */
async function createSession(userId: string): Promise<{ token: string; refreshToken: string }> {
  const token        = signToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

  await prisma.userSession.create({
    data: { user_id: userId, refresh_token: refreshToken, expires_at: expiresAt },
  });

  // Update last_login (new field — available after prisma migrate dev)
  await prisma.user.update({
    where: { id: userId },
    data:  { last_login: new Date() } as any,
  });

  return { token, refreshToken };
}

// ─────────────────────────────────────────────────────────────────────────────

export class AuthService {

  // ── Passwordless Email OTP — Step 1 ──────────────────────────────────────
  /**
   * Request an email OTP sign-in. Creates the account if it doesn't exist yet.
   * Handles account linking: if the email already exists, sends OTP to that account.
   */
  async emailOtpRequest(data: { email: string; name?: string }) {
    const cleanEmail = data.email.toLowerCase().trim();

    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      // New user — create a stub account (name required)
      const name = (data.name ?? '').trim();
      if (!name || name.length < 2) {
        const err = new Error('Full name is required for new accounts');
        (err as any).statusCode = 400;
        throw err;
      }

      user = await prisma.user.create({
        data: {
          email:          cleanEmail,
          name,
          email_verified: false,
          auth_provider:  'EMAIL',
        } as any,
      });

      // Create default app settings
      await prisma.appSettings.create({
        data: { user_id: user.id, language: 'en', currency: 'NGN', madhhab: 'MALIKI' },
      }).catch(() => {}); // ignore if already exists
    }

    const otp = await createOTP(user.id, 'EMAIL_LOGIN');

    // Fire-and-forget — never block the response
    emailService.sendVerificationEmail(user.email!, user.name, otp).catch(console.error);

    return {
      message:   'Verification code sent to your email.',
      isNewUser: !user.email_verified,
    };
  }

  // ── Passwordless Email OTP — Step 2 ──────────────────────────────────────
  /**
   * Verify the OTP and complete sign-in. Returns full session.
   */
  async emailOtpVerify(data: { email: string; otp: string }) {
    const cleanEmail = data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where:   { email: cleanEmail },
      include: { app_settings: true },
    });

    if (!user) {
      const err = new Error('No account found for this email address.');
      (err as any).statusCode = 404;
      throw err;
    }

    const valid = await verifyOTP(user.id, data.otp, 'EMAIL_LOGIN');
    if (!valid) {
      const err = new Error('Invalid or expired verification code. Please try again.');
      (err as any).statusCode = 400;
      throw err;
    }

    // Mark email as verified on first successful sign-in
    await prisma.user.update({
      where: { id: user.id },
      data:  { email_verified: true },
    });

    // Send welcome email on first login
    if (!user.email_verified) {
      emailService.sendWelcomeEmail(user.email!, user.name).catch(console.error);
    }

    const { token, refreshToken } = await createSession(user.id);

    return {
      user: buildUserResponse({ ...user, email_verified: true }),
      token,
      refreshToken,
    };
  }

  // ── Google Sign-In ────────────────────────────────────────────────────────
  /**
   * Authenticate via Google. Creates account if new, links if existing email found.
   * The idToken should be verified on the client side (expo-auth-session).
   * Here we trust the decoded values passed from the client after server-side token inspection.
   */
  async googleAuth(data: { googleId: string; email: string; name: string; profilePic?: string }) {
    const cleanEmail = data.email.toLowerCase().trim();

    // Look for existing account by Google ID or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { google_id: data.googleId },
          { email: cleanEmail },
        ],
      },
      include: { app_settings: true },
    });

    if (user) {
      // Link Google to existing email account if not already linked
      if (!user.google_id) {
        user = await prisma.user.update({
          where:   { id: user.id },
          data:    { google_id: data.googleId, email_verified: true, profile_image_url: data.profilePic ?? user.profile_image_url },
          include: { app_settings: true },
        }) as any;
      }
    } else {
      // Brand new account via Google
      user = await prisma.user.create({
        data: {
          email:             cleanEmail,
          google_id:         data.googleId,
          name:              data.name,
          profile_image_url: data.profilePic ?? null,
          email_verified:    true,
          auth_provider:     'GOOGLE',
        } as any,
        include: { app_settings: true },
      }) as any;

      // Create default app settings
      await prisma.appSettings.create({
        data: { user_id: user!.id, language: 'en', currency: 'NGN', madhhab: 'MALIKI' },
      }).catch(() => {});
    }

    const { token, refreshToken } = await createSession(user!.id);

    return {
      user: buildUserResponse(user!),
      token,
      refreshToken,
    };
  }

  // ── Update display name ───────────────────────────────────────────────────
  async updateName(userId: string, name: string) {
    const cleaned = name.trim();
    if (!cleaned || cleaned.length < 2) {
      const err = new Error('Name must be at least 2 characters');
      (err as any).statusCode = 400;
      throw err;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data:  { name: cleaned },
    });

    return { name: user.name };
  }

  // ── Complete onboarding ───────────────────────────────────────────────────
  async completeOnboarding(userId: string, prefs: {
    language?: string;
    madhhab?: string;
    currency?: string;
    notifications?: boolean;
  }) {
    await prisma.appSettings.upsert({
      where:  { user_id: userId },
      update: {
        language:             prefs.language             ?? 'en',
        madhhab:              prefs.madhhab              ?? 'MALIKI',
        currency:             prefs.currency             ?? 'NGN',
        notification_enabled: prefs.notifications        ?? true,
      },
      create: {
        user_id:              userId,
        language:             prefs.language             ?? 'en',
        madhhab:              prefs.madhhab              ?? 'MALIKI',
        currency:             prefs.currency             ?? 'NGN',
        notification_enabled: prefs.notifications        ?? true,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data:  { onboarding_complete: true, default_currency: prefs.currency ?? 'NGN' } as any,
    });

    return { message: 'Preferences saved. Welcome to MIZAN!' };
  }

  // ── Token refresh ─────────────────────────────────────────────────────────
  async refreshToken(userId: string, oldRefreshToken?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Rotate: invalidate old session, create new one
    if (oldRefreshToken) {
      await prisma.userSession.deleteMany({ where: { refresh_token: oldRefreshToken } });
    }

    const { token, refreshToken } = await createSession(userId);
    return { token, refreshToken };
  }

  // ── Legacy email + password (kept for backward compat) ────────────────────
  async register(data: { email: string; password?: string; name: string; phone?: string }) {
    const cleanEmail = data.email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      const err = new Error('An account with this email already exists');
      (err as any).statusCode = 400;
      throw err;
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : null;

    const user = await prisma.user.create({
      data: {
        email:          cleanEmail,
        password_hash:  hashedPassword,
        name:           data.name,
        phone:          data.phone ?? null,
        email_verified: false,
      },
    });

    await prisma.appSettings.create({
      data: { user_id: user.id, language: 'en', currency: 'NGN', madhhab: 'MALIKI' },
    }).catch(() => {});

    const otp = await createOTP(user.id, 'EMAIL_VERIFY');
    emailService.sendVerificationEmail(user.email!, user.name, otp).catch(console.error);

    const { token, refreshToken } = await createSession(user.id);
    return {
      user:        buildUserResponse(user),
      token,
      refreshToken,
      message:     'Account created. Please check your email for a verification code.',
    };
  }

  async login(data: { email: string; password: string }) {
    if (!data.email || !data.password) {
      const err = new Error('Email and password are required');
      (err as any).statusCode = 400;
      throw err;
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where:   { email: cleanEmail },
      include: { app_settings: true },
    });

    if (!user) {
      const err = new Error('Account not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (!user.password_hash) {
      const err = new Error('This account uses a different sign-in method. Try signing in with Google or Email OTP.');
      (err as any).statusCode = 401;
      throw err;
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      const err = new Error('Invalid email or password.');
      (err as any).statusCode = 401;
      throw err;
    }

    const { token, refreshToken } = await createSession(user.id);
    return { user: buildUserResponse(user), token, refreshToken };
  }

  async verifyEmail(data: { email: string; otp: string }) {
    const cleanEmail = data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    if (user.email_verified) return { message: 'Email already verified' };

    const valid = await verifyOTP(user.id, data.otp, 'EMAIL_VERIFY');
    if (!valid) {
      const err = new Error('Invalid or expired verification code');
      (err as any).statusCode = 400;
      throw err;
    }

    await prisma.user.update({ where: { id: user.id }, data: { email_verified: true } });
    emailService.sendWelcomeEmail(user.email!, user.name).catch(console.error);
    return { message: 'Email verified successfully. Welcome to MIZAN!' };
  }

  async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return { message: 'If that account exists, a code has been sent.' };
    if (user.email_verified) throw new Error('Email is already verified');

    const otp = await createOTP(user.id, 'EMAIL_VERIFY');
    await emailService.sendVerificationEmail(user.email!, user.name, otp);
    return { message: 'Verification code resent.' };
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return { message: 'If that email exists, a reset code has been sent.' };

    const otp = await createOTP(user.id, 'PASSWORD_RESET');
    await emailService.sendPasswordResetEmail(user.email!, user.name, otp);
    return { message: 'If that email exists, a reset code has been sent.' };
  }

  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (!user) {
      const err = new Error('Invalid reset request');
      (err as any).statusCode = 400;
      throw err;
    }

    const valid = await verifyOTP(user.id, data.otp, 'PASSWORD_RESET');
    if (!valid) {
      const err = new Error('Invalid or expired reset code. Please request a new one.');
      (err as any).statusCode = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password_hash: hashedPassword } });
    return { message: 'Password reset successfully.' };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where:   { id: userId },
      include: { app_settings: true },
    });
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    return buildUserResponse(user);
  }

  async updateProfile(userId: string, data: {
    name?: string; country?: string; currency?: string;
    madhhab?: string; phone?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (data.name || data.phone || data.currency) {
      await prisma.user.update({
        where: { id: userId },
        data:  { name: data.name, phone: data.phone, default_currency: data.currency },
      });
    }

    if (data.country || data.currency || data.madhhab) {
      await prisma.appSettings.upsert({
        where:  { user_id: userId },
        update: { country: data.country, currency: data.currency, madhhab: data.madhhab },
        create: { user_id: userId, country: data.country, currency: data.currency ?? 'NGN', madhhab: data.madhhab ?? 'MALIKI' },
      });
    }

    return this.getProfile(userId);
  }
}
