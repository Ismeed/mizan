/**
 * MIZAN — Supabase Authentication Service
 *
 * All authentication operations go through this service.
 * This is the ONLY file that calls supabase.auth.* methods.
 *
 * SECURITY:
 * • Never logs tokens, OTPs, or keys.
 * • Never accepts a client-supplied user ID for auth operations.
 * • Google Client Secret never appears here (handled by Supabase + Google Cloud).
 * • Redirect URL generated through Expo Linking / AuthSession, never hardcoded.
 */
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';
import { profileService } from './profile.service';
import { preferenceService } from './preference.service';
import type { Session, User } from '@supabase/supabase-js';
import type { MizanProfile } from '../types/database.types';

// Ensure WebBrowser completes the auth session
WebBrowser.maybeCompleteAuthSession();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthResult {
  session: Session;
  user:    User;
  profile: MizanProfile | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generate platform-aware redirect URL.
 * Native: mizan://auth/callback
 * Web: http://localhost:8081/auth/callback or current window origin
 */
export function getPlatformAwareRedirectUrl(): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}/auth/callback`;
    }
    return makeRedirectUri({ path: 'auth/callback' });
  }
  return Linking.createURL('auth/callback');
}

/**
 * Extract the best available first name from Supabase user metadata.
 * Priority: given_name → first_name → full_name → name → user_metadata
 */
export function resolveGoogleFirstName(userOrMeta: User | Record<string, any> | null | undefined): string {
  if (!userOrMeta) return '';
  const meta = (userOrMeta as any)?.user_metadata ?? userOrMeta;

  if (meta.given_name) return String(meta.given_name).trim();
  if (meta.first_name) return String(meta.first_name).trim();
  if (meta.full_name) {
    const first = String(meta.full_name).trim().split(' ')[0];
    if (first) return first;
  }
  if (meta.name) {
    const first = String(meta.name).trim().split(' ')[0];
    if (first) return first;
  }
  return '';
}

/**
 * Extract full name (first name + surname) from Supabase user metadata.
 * Priority: (given_name + family_name) → (first_name + surname/last_name) → full_name → name
 */
export function resolveGoogleFullName(userOrMeta: User | Record<string, any> | null | undefined): string {
  if (!userOrMeta) return '';
  const meta = (userOrMeta as any)?.user_metadata ?? userOrMeta;

  const given = meta.given_name || meta.first_name || '';
  const family = meta.family_name || meta.surname || meta.last_name || '';

  if (given || family) {
    return [String(given).trim(), String(family).trim()].filter(Boolean).join(' ');
  }

  if (meta.full_name) return String(meta.full_name).trim();
  if (meta.name) return String(meta.name).trim();

  return '';
}

/** Determine whether a Google user needs first-name confirmation. */
export function googleUserNeedsNameConfirmation(user: User | null | undefined): boolean {
  if (!user) return true;
  const firstName = resolveGoogleFirstName(user);
  return !firstName || firstName.length < 2;
}

// ── Auth Service ──────────────────────────────────────────────────────────────

export const authSupabaseService = {

  // ── Session restoration ────────────────────────────────────────────────────

  /**
   * Restore the persisted session on app startup.
   * Returns { session, user, profile } or null if no valid session.
   * NEVER throws — errors are captured and treated as "no session".
   */
  async restoreSession(): Promise<AuthResult | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      const profile = await profileService.getCurrentProfile();
      return { session, user: session.user, profile };
    } catch (err) {
      console.warn('[AuthService] Session restore failed:', (err as Error).message);
      return null;
    }
  },

  // ── Google OAuth ────────────────────────────────────────────────────────────

  /**
   * Start Google OAuth flow using Supabase Auth.
   * Platform-aware:
   *   - Native: Uses PKCE + WebBrowser.openAuthSessionAsync with mizan:// scheme
   *   - Web: Redirects browser directly using window origin
   */
  async signInWithGoogle(): Promise<AuthResult | null> {
    const redirectTo = getPlatformAwareRedirectUrl();

    if (__DEV__) {
      console.log('[GoogleOAuth] Generated Redirect URL:', redirectTo);
    }

    // Web handling
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: ERROR');
        throw new Error(error.message ?? 'Failed to start Google authentication');
      }

      if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: REDIRECTING_WEB');
      return null; // Browser is redirecting
    }

    // Native handling (Android/iOS)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error || !data?.url) {
      if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: ERROR');
      throw new Error(error?.message ?? 'Failed to start Google authentication');
    }

    // Open browser for Google sign-in
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success' || !result.url) {
      if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: CANCELLED');
      return null; // User cancelled or dismissed
    }

    // Extract auth tokens from the callback URL
    const url    = new URL(result.url);
    const code   = url.searchParams.get('code');
    const hash   = result.url.split('#')[1] ?? '';
    const params = new URLSearchParams(hash);

    // Try code-based exchange first (PKCE), then implicit hash params
    if (code) {
      const { data: exchangeData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError || !exchangeData.session) {
        if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: EXCHANGE_FAILED');
        throw new Error(exchangeError?.message ?? 'Failed to exchange code for session');
      }
      const profile = await profileService.getCurrentProfile();

      if (__DEV__) {
        console.log('[GoogleOAuth] OAuth Result Status: SUCCESS');
        console.log('[GoogleOAuth] Session Exists:', !!exchangeData.session);
        console.log('[GoogleOAuth] User Metadata Exists:', !!exchangeData.user?.user_metadata);
      }

      return { session: exchangeData.session, user: exchangeData.user, profile };
    }

    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (sessionError || !sessionData.session) {
        if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: TOKEN_SET_FAILED');
        throw new Error(sessionError?.message ?? 'Failed to establish session from tokens');
      }
      const profile = await profileService.getCurrentProfile();

      if (__DEV__) {
        console.log('[GoogleOAuth] OAuth Result Status: SUCCESS');
        console.log('[GoogleOAuth] Session Exists:', !!sessionData.session);
        console.log('[GoogleOAuth] User Metadata Exists:', !!sessionData.user?.user_metadata);
      }

      return { session: sessionData.session, user: sessionData.user!, profile };
    }

    if (__DEV__) console.log('[GoogleOAuth] OAuth Result Status: NO_TOKENS');
    throw new Error('Google OAuth callback did not return usable tokens');
  },

  // ── Email OTP ────────────────────────────────────────────────────────────────

  /**
   * Request an email OTP (magic link / passwordless OTP).
   * Creates a new user if one doesn't exist.
   */
  async requestEmailOtp(opts: {
    email:     string;
    firstName: string;
    surname:   string;
  }): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email: opts.email,
      options: {
        shouldCreateUser: true,
        data: {
          first_name:           opts.firstName,
          surname:              opts.surname,
          onboarding_completed: false,
        },
      },
    });

    if (error) {
      throw new Error(error.message ?? 'Failed to send verification code');
    }
  },

  /**
   * Verify an email OTP.
   * On success: returns session + user + profile.
   * Auto-provisions default preferences if they don't exist yet.
   */
  async verifyEmailOtp(opts: {
    email: string;
    otp:   string;
  }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.verifyOtp({
      email: opts.email,
      token: opts.otp,
      type:  'email',
    });

    if (error || !data.session || !data.user) {
      throw new Error(error?.message ?? 'Invalid or expired verification code');
    }

    // Auto-provision default preferences
    await preferenceService.createDefaultPreferences(data.user.id);

    const profile = await profileService.getCurrentProfile();
    return { session: data.session, user: data.user, profile };
  },

  // ── Session Operations ──────────────────────────────────────────────────────

  /** Explicit user-initiated sign out. */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on sign out — local state will be cleared anyway
    }
  },

  /** Legacy compat wrappers */
  googleSignIn: async (_data: any): Promise<{ user: any; token: string }> => {
    const result = await authSupabaseService.signInWithGoogle();
    if (!result) throw new Error('Google authentication failed');
    return {
      user:  result.user,
      token: result.session.access_token,
    };
  },

  confirmName: async (name: string): Promise<void> => {
    await profileService.updateFirstName(name);
  },

  completeOnboarding: async (prefs: Record<string, any>): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await preferenceService.updatePreferences({
        languageTag:  prefs.language,
        madhhabId:    prefs.madhhab,
        currencyCode: prefs.currency,
      });
      await profileService.upsertCurrentProfile({ onboardingCompleted: true });
    }
  },

  updateProfile: async (data: Record<string, any>): Promise<any> => {
    return profileService.upsertCurrentProfile({
      firstName: data.name,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await supabase.auth.resetPasswordForEmail(email);
  },

  resetPassword: async (email: string, token: string, newPassword: string): Promise<void> => {
    await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
    await supabase.auth.updateUser({ password: newPassword });
  },
};
