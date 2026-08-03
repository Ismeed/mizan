/**
 * MIZAN Authentication Store — Supabase-backed 7-State Machine
 *
 * This is the SINGLE source of truth for authentication state.
 * It is backed by the Supabase session (not a custom JWT).
 *
 * State transitions:
 *   INITIALIZING       → AUTHENTICATED | UNAUTHENTICATED | ONBOARDING_REQUIRED
 *   AUTHENTICATED      → REFRESHING_SESSION → AUTHENTICATED | SESSION_REVOKED
 *   AUTHENTICATED      → UNAUTHENTICATED (explicit logout)
 *   AUTHENTICATED      → ONBOARDING_REQUIRED
 *   ONBOARDING_REQUIRED → AUTHENTICATED
 *   Any                → AUTH_ERROR (recoverable)
 *   Any                → SESSION_REVOKED (redirect to auth)
 *
 * CRITICAL:
 * • Only this store may invalidate a session.
 * • logout() / revokeSession() must NEVER be called from feature error handlers.
 * • Preference, AI, Mirath, Zakat errors must stay in their own state.
 */
import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { MizanProfile } from '../types/database.types';

export type AuthStatus =
  | 'INITIALIZING'         // App startup — session restore in progress
  | 'AUTHENTICATED'        // Valid Supabase session + profile loaded
  | 'UNAUTHENTICATED'      // No session (or explicit logout)
  | 'REFRESHING_SESSION'   // Token refresh in-flight
  | 'ONBOARDING_REQUIRED'  // Authenticated but onboarding not complete
  | 'AUTH_ERROR'           // Recoverable error
  | 'SESSION_REVOKED';     // Backend rejected session → redirect to auth

export type MizanUser = User & {
  name?: string;
  isPremium?: boolean;
};

interface AuthState {
  // ── State machine ──────────────────────────────────────────────────────────
  status:             AuthStatus;
  isHydrated:         boolean;    // true after first session-restore attempt
  session:            Session | null;
  user:               MizanUser | null;
  profile:            MizanProfile | null;
  onboardingComplete: boolean;
  error:              string | null;

  // ── Legacy compat ──────────────────────────────────────────────────────────
  /** Alias for session?.access_token — for backward compat with api.client.ts */
  accessToken:        string | null;

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Mark hydration complete without changing auth status */
  setHydrated: () => void;

  /**
   * Called after successful sign-in (email OTP or Google).
   * Derives the correct status from profile.onboardingCompleted.
   */
  setSession: (session: Session, profile: MizanProfile | null) => void;

  /** Update profile without changing session */
  setProfile: (profile: MizanProfile) => void;

  /** Update auth status (e.g. REFRESHING_SESSION, AUTH_ERROR) */
  setStatus: (status: AuthStatus) => void;

  /** Set recoverable error message */
  setError: (error: string | null) => void;

  /**
   * Explicit user-initiated logout.
   * Clears all session state.
   * ONLY call from logout UI actions — NEVER from feature errors.
   */
  logout: () => void;

  /**
   * Backend definitively rejected the session (refresh token expired).
   * Sets status to SESSION_REVOKED so the route guard redirects once.
   * NEVER call from feature-level errors.
   */
  revokeSession: () => void;

  // ── Legacy compat aliases ──────────────────────────────────────────────────
  /** @deprecated Use setSession instead */
  setAuth: (user: any, token: string) => void;
  /** @deprecated Use setProfile instead */
  setUser: (user: any) => void;
  /** @deprecated Use setHydrated + setStatus instead */
  setOnboardingComplete: (value: boolean) => void;
  /** @deprecated Use setSession token field */
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // ── Initial state ────────────────────────────────────────────────────────
  status:             'INITIALIZING',
  isHydrated:         false,
  session:            null,
  user:               null,
  profile:            null,
  onboardingComplete: false,
  accessToken:        null,
  error:              null,

  // ── Actions ──────────────────────────────────────────────────────────────

  setHydrated: () => set({ isHydrated: true }),

  setSession: (session, profile) => {
    const onboardingComplete = profile?.onboardingCompleted ?? false;
    const enrichedUser: MizanUser = {
      ...session.user,
      name: profile?.displayName || (session.user.user_metadata?.full_name as string) || (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'User',
      isPremium: (session.user.user_metadata?.is_premium as boolean) ?? false,
    };
    set({
      status:             onboardingComplete ? 'AUTHENTICATED' : 'ONBOARDING_REQUIRED',
      isHydrated:         true,
      session,
      user:               enrichedUser,
      accessToken:        session.access_token,
      profile,
      onboardingComplete,
      error:              null,
    });
  },

  setProfile: (profile) => set({
    profile,
    onboardingComplete: profile.onboardingCompleted,
    status: profile.onboardingCompleted
      ? 'AUTHENTICATED'
      : get().status === 'AUTHENTICATED' ? 'ONBOARDING_REQUIRED' : get().status,
  }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  logout: () => set({
    status:             'UNAUTHENTICATED',
    isHydrated:         true,
    session:            null,
    user:               null,
    accessToken:        null,
    profile:            null,
    onboardingComplete: false,
    error:              null,
  }),

  revokeSession: () => set({
    status:             'SESSION_REVOKED',
    isHydrated:         true,
    session:            null,
    user:               null,
    accessToken:        null,
    profile:            null,
    onboardingComplete: false,
    error:              'Your session has expired. Please sign in again.',
  }),

  // ── Legacy compat ────────────────────────────────────────────────────────

  setAuth: (user: any, token: string) => {
    console.warn('[AuthStore] setAuth is deprecated — use setSession instead');
    const onboardingComplete = user?.onboardingComplete ?? false;
    set({
      status:             onboardingComplete ? 'AUTHENTICATED' : 'ONBOARDING_REQUIRED',
      isHydrated:         true,
      user,
      accessToken:        token,
      onboardingComplete,
      error:              null,
    });
  },

  setUser: (user: any) => {
    set({ user, profile: user as any });
  },

  setOnboardingComplete: (value: boolean) => set((state) => ({
    onboardingComplete: value,
    status: value ? 'AUTHENTICATED' : state.status,
    profile: state.profile ? { ...state.profile, onboardingCompleted: value } : state.profile,
  })),

  setAccessToken: (token: string) => set({ accessToken: token, status: 'AUTHENTICATED' }),
}));

// ── Selectors ────────────────────────────────────────────────────────────────

export const selectIsHydrated          = (s: AuthState) => s.isHydrated;
export const selectIsAuthenticated     = (s: AuthState) =>
  (s.status === 'AUTHENTICATED') && !!s.session;
export const selectShouldRedirectToAuth = (s: AuthState) =>
  s.isHydrated && (s.status === 'UNAUTHENTICATED' || s.status === 'SESSION_REVOKED');
export const selectIsInitializing      = (s: AuthState) =>
  !s.isHydrated || s.status === 'INITIALIZING';
