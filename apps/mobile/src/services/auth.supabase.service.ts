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
 * • Redirect URL generated through Expo Linking, never hardcoded.
 */
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
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
 * Extract the best available first name from Supabase user metadata.
 * Priority: given_name → first_name → first word of full_name/name → ''
 */
export function resolveGoogleFirstName(user: User): string {
  const meta = user.user_metadata ?? {};
  if (meta.given_name)               return String(meta.given_name).trim();
  if (meta.first_name)               return String(meta.first_name).trim();
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

/** Determine whether a Google user needs first-name confirmation. */
export function googleUserNeedsNameConfirmation(user: User): boolean {
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
   * Start Google OAuth flow using Supabase Auth + Expo WebBrowser.
   * The redirect URL is generated from the app scheme, never hardcoded.
   *
   * Flow:
   *   1. Generate redirect URL (mizan://auth/callback)
   *   2. Get Supabase OAuth URL
   *   3. Open in system browser
   *   4. Receive callback
   *   5. Exchange for session
   *   6. Return { session, user, profile }
   */
  async signInWithGoogle(): Promise<AuthResult | null> {
    // Generate the redirect URL from the registered app scheme
    const redirectTo = Linking.createURL('auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data?.url) {
      throw new Error(error?.message ?? 'Failed to start Google authentication');
    }

    // Open browser for Google sign-in
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success' || !result.url) {
      return null; // User cancelled
    }

    // Extract auth tokens from the callback URL
    const url   = new URL(result.url);
    const code  = url.searchParams.get('code');
    const hash  = result.url.split('#')[1] ?? '';
    const params = new URLSearchParams(hash);

    // Try code-based exchange first (PKCE), then implicit hash params
    if (code) {
      const { data: exchangeData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError || !exchangeData.session) {
        throw new Error(exchangeError?.message ?? 'Failed to exchange code for session');
      }
      const profile = await profileService.getCurrentProfile();
      return { session: exchangeData.session, user: exchangeData.user, profile };
    }

    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (sessionError || !sessionData.session) {
        throw new Error(sessionError?.message ?? 'Failed to establish session from tokens');
      }
      const profile = await profileService.getCurrentProfile();
      return { session: sessionData.session, user: sessionData.user!, profile };
    }

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
   * Verify the 6-digit OTP entered by the user.
   * On success: creates/updates profile, creates default preferences.
   */
  async verifyEmailOtp(opts: {
    email:     string;
    token:     string;
    firstName: string;
    surname:   string;
  }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.verifyOtp({
      email: opts.email,
      token: opts.token,
      type:  'email',
    });

    if (error || !data.session || !data.user) {
      throw new Error(error?.message ?? 'Invalid or expired verification code');
    }

    // Upsert profile with confirmed names
    await profileService.upsertCurrentProfile({
      email:               opts.email,
      firstName:           opts.firstName,
      surname:             opts.surname,
      onboardingCompleted: true,
    }).catch((e) => console.warn('[AuthService] Profile upsert warning:', e?.message));

    // Ensure preferences row exists
    await preferenceService.createDefaultPreferences(data.user.id)
      .catch((e) => console.warn('[AuthService] Preferences init warning:', e?.message));

    const profile = await profileService.getCurrentProfile();
    return { session: data.session, user: data.user, profile };
  },

  // ── Google name confirmation ─────────────────────────────────────────────────

  /**
   * Called after Google sign-in when the user confirms or edits their first name.
   * Updates Supabase user metadata and the public profiles table.
   */
  async confirmGoogleName(firstName: string): Promise<MizanProfile | null> {
    const trimmed = firstName.trim();
    if (!trimmed || trimmed.length < 2) {
      throw new Error('First name must be at least 2 characters');
    }

    // Update Supabase user metadata
    await supabase.auth.updateUser({
      data: { first_name: trimmed },
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session during name confirmation');

    // Get surname from metadata if available
    const meta    = session.user.user_metadata ?? {};
    const surname = meta.family_name ? String(meta.family_name).trim() : '';

    // Update profile and complete onboarding
    const profile = await profileService.completeOnboarding(trimmed, surname || undefined);
    await preferenceService.createDefaultPreferences(session.user.id).catch(() => {});

    return profile;
  },

  // ── Explicit logout ──────────────────────────────────────────────────────────

  /**
   * Sign the user out of Supabase.
   * ONLY call this from explicit user-initiated logout actions.
   * NEVER call from feature error handlers.
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  // ── Auth state subscription ──────────────────────────────────────────────────

  /**
   * Subscribe to Supabase auth state changes.
   * Returns an unsubscribe function — call it in useEffect cleanup.
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },
};
