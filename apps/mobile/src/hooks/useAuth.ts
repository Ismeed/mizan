import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const {
    user, token,
    onboardingComplete,
    setAuth, setUser, setOnboardingComplete,
    logout: storeLogout,
    error: storeError,
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
      setError(err.message ?? 'Failed to save preferences.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = async () => {
    await authService.logout();
    storeLogout();
  };

  // ── Update Profile ──────────────────────────────────────────────────────
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
    user,
    token,
    isAuthenticated:    !!token,
    onboardingComplete,
    isLoading,
    error:              error ?? storeError,
    // New passwordless
    requestOtp,
    verifyOtp,
    signInWithGoogle,
    confirmName,
    completeOnboarding,
    // Core
    logout,
    updateProfile,
    // Legacy compat
    verifyEmail,
    forgotPassword,
    resetPassword,
  };
};
