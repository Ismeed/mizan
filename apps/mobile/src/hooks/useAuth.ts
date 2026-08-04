/**
 * useAuth — primary authentication hook for MIZAN components.
 *
 * Wraps the auth store and Supabase auth service. Provides typed, loading-aware
 * actions for all auth flows.
 *
 * CRITICAL: This hook must NEVER call logout() or revokeSession() from
 * feature-level error handlers (AI, Mirath, Zakat, preference updates).
 * Those errors must be handled locally within their own hooks/stores.
 */
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { authSupabaseService } from '../services/auth.supabase.service';
import { profileService } from '../services/profile.service';

export const useAuth = () => {
  const {
    user,
    accessToken,
    status,
    isHydrated,
    onboardingComplete,
    setSession,
    setProfile,
    setUser,
    setOnboardingComplete,
    logout:        storeLogout,
    revokeSession: storeRevoke,
    error:         storeError,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── Email OTP — Step 1 ──────────────────────────────────────────────────
  const requestOtp = async (email: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const parts     = (name ?? '').trim().split(' ');
      const firstName = parts[0] ?? '';
      const surname   = parts.slice(1).join(' ');
      await authSupabaseService.requestEmailOtp({ email, firstName, surname });
      return true;
    } catch (err: any) {
      setError(err.message ?? 'Failed to send verification code.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Email OTP — Step 2 ──────────────────────────────────────────────────
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authSupabaseService.verifyEmailOtp({ email, otp });
      setSession(result.session, result.profile);
      return true;
    } catch (err: any) {
      setError(err.message ?? 'Verification failed. Please check the code.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────
  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authSupabaseService.signInWithGoogle();
      if (result?.session) {
        setSession(result.session, result.profile);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message ?? 'Google sign-in failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Confirm name (post-Google) ──────────────────────────────────────────
  const confirmName = async (name: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authSupabaseService.confirmName(name);
      const profile = await profileService.getCurrentProfile();
      if (profile) setProfile(profile);
      return true;
    } catch (err: any) {
      setError(err.message ?? 'Failed to update name.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Complete onboarding ─────────────────────────────────────────────────
  const completeOnboarding = async (prefs: {
    language?: string; madhhab?: string; currency?: string; notifications?: boolean;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await authSupabaseService.completeOnboarding(prefs);
      const profile = await profileService.getCurrentProfile();
      if (profile) {
        setProfile(profile);
      } else {
        setOnboardingComplete(true);
      }
      return true;
    } catch (err: any) {
      setOnboardingComplete(true);
      return true; // Always succeed locally
    } finally {
      setIsLoading(false);
    }
  };

  // ── Explicit Logout ─────────────────────────────────────────────────────
  /**
   * ONLY call this from explicit user-initiated logout actions.
   * NEVER call this from feature error handlers.
   */
  const logout = async () => {
    try {
      await authSupabaseService.logout();
    } catch {
      // Ignore errors — local state must still be cleared
    }
    storeLogout();
  };

  // ── Update Profile ──────────────────────────────────────────────────────
  /**
   * Updates profile fields. On error, preserves auth state.
   * Does NOT call logout() or revokeSession() on failure.
   */
  const updateProfile = async (data: {
    name?: string; country?: string; currency?: string; madhhab?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authSupabaseService.updateProfile(data);
      if (updated) setProfile(updated);
      return true;
    } catch (err: any) {
      // Keep session — this is a feature-level error
      setError(err.message ?? 'Update failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Legacy (OTP screen backward compat) ────────────────────────────────
  const verifyEmail = async (email: string, otp: string): Promise<boolean> =>
    verifyOtp(email, otp);

  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authSupabaseService.forgotPassword(email);
      return true;
    } catch { return false; } finally { setIsLoading(false); }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authSupabaseService.resetPassword(email, otp, newPassword);
      return true;
    } catch { return false; } finally { setIsLoading(false); }
  };

  return {
    // State
    user,
    token:              accessToken,  // Alias for backward compat
    accessToken,
    status,
    isHydrated,
    isAuthenticated:    status === 'AUTHENTICATED' && !!accessToken,
    onboardingComplete,
    isLoading,
    error:              error ?? storeError,

    // New passwordless actions
    requestOtp,
    verifyOtp,
    signInWithGoogle,
    confirmName,
    completeOnboarding,

    // Core actions
    logout,
    updateProfile,

    // Legacy compat
    verifyEmail,
    forgotPassword,
    resetPassword,
  };
};

