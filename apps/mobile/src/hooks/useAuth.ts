/**
 * useAuth — primary authentication hook for MIZAN components.
 *
 * Wraps the auth store and auth service. Provides typed, loading-aware
 * actions for all auth flows.
 *
 * CRITICAL: This hook must NEVER call logout() or revokeSession() from
 * feature-level error handlers (AI, Mirath, Zakat, preference updates).
 * Those errors must be handled locally within their own hooks/stores.
 */
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const {
    user,
    accessToken,
    status,
    isHydrated,
    onboardingComplete,
    setAuth,
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
      await authService.requestEmailOtp({ email, name });
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
      const response = await authService.verifyEmailOtp({ email, otp });
      // setAuth derives the correct status from user.onboardingComplete
      setAuth(response.user as any, response.token);
      return true;
    } catch (err: any) {
      setError(err.message ?? 'Verification failed. Please check the code.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────
  const signInWithGoogle = async (data: {
    googleId: string; email: string; name: string; profilePic?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleSignIn(data);
      setAuth(response.user as any, response.token);
      return true;
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
      await authService.confirmName(name);
      if (user) setUser({ ...user, name } as any);
      return true;
    } catch (err: any) {
      // Non-critical — name was saved locally in authService.confirmName
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
      await authService.completeOnboarding(prefs);
      setOnboardingComplete(true);
      if (user) setUser({ ...user, onboardingComplete: true, ...prefs } as any);
      return true;
    } catch (err: any) {
      // authService.completeOnboarding saves locally on server failure
      // so onboarding is still marked complete
      setOnboardingComplete(true);
      if (user) setUser({ ...user, onboardingComplete: true, ...prefs } as any);
      return true; // Always succeed — offline is supported
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
      await authService.logout();
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
      const updated = await authService.updateProfile(data);
      setUser({ ...user!, ...updated });
      return true;
    } catch (err: any) {
      // Keep session — this is a feature-level error
      setError(err.response?.data?.message ?? err.message ?? 'Update failed');
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
      await authService.forgotPassword(email);
      return true;
    } catch { return false; } finally { setIsLoading(false); }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
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
