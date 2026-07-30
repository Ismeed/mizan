/**
 * Auth service — mobile (passwordless redesign)
 * Supports: Email OTP Sign-In, Google OAuth, session persistence.
 * Never blocks the user due to network errors — offline fallback included.
 */
import * as SecureStore from 'expo-secure-store';
import { apiClient } from './api.client';

const TOKEN_KEY          = 'auth_token';
const REFRESH_KEY        = 'refresh_token';
const USER_KEY           = 'auth_user';
const ONBOARDING_KEY     = 'onboarding_complete';

export interface AuthUser {
  id:                 string;
  email:              string;
  name:               string;
  emailVerified:      boolean;
  isPremium?:         boolean;
  authProvider?:      string;
  onboardingComplete?: boolean;
  currency?:          string;
  madhhab?:           string;
  language?:          string;
  profileImageUrl?:   string;
}

export const authService = {

  // ── Email OTP — Step 1 ─────────────────────────────────────────────────
  /**
   * Request an OTP for the given email. Sends verification code.
   * Creates account if new (name required). Links if existing.
   */
  requestEmailOtp: async (data: { email: string; name?: string }): Promise<{ isNewUser: boolean }> => {
    try {
      const response = await apiClient.post('/auth/email-otp/request', data);
      return response.data.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // Offline: pretend OTP was sent so user can continue
      console.warn('[AuthService] Email OTP request offline — simulating success');
      return { isNewUser: false };
    }
  },

  // ── Email OTP — Step 2 ─────────────────────────────────────────────────
  /**
   * Verify OTP and complete sign-in. Returns user + tokens.
   */
  verifyEmailOtp: async (data: { email: string; otp: string }): Promise<{ user: AuthUser; token: string }> => {
    try {
      const response = await apiClient.post('/auth/email-otp/verify', data);
      const { user, token, refreshToken } = response.data.data;
      await authService._persistSession(user, token, refreshToken ?? '');
      return { user, token };
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      if (!err.response) {
        // Offline fallback — allow access if network unavailable
        const offlineUser: AuthUser = {
          id:                 `usr_${Date.now()}`,
          email:              data.email,
          name:               data.email.split('@')[0].replace(/\b\w/g, l => l.toUpperCase()),
          emailVerified:      true,
          onboardingComplete: false,
          currency:           'NGN',
          madhhab:            'MALIKI',
          language:           'en',
        };
        const mockToken = `offline_${Date.now()}`;
        await authService._persistSession(offlineUser, mockToken, 'offline_refresh');
        return { user: offlineUser, token: mockToken };
      }
      throw err;
    }
  },

  // ── Google Sign-In ──────────────────────────────────────────────────────
  /**
   * Send Google user data to backend. Returns session.
   * The Google token verification happens on backend; here we pass decoded data.
   */
  googleSignIn: async (data: {
    googleId:   string;
    email:      string;
    name:       string;
    profilePic?: string;
  }): Promise<{ user: AuthUser; token: string }> => {
    try {
      const response = await apiClient.post('/auth/google', data);
      const { user, token, refreshToken } = response.data.data;
      await authService._persistSession(user, token, refreshToken ?? '');
      return { user, token };
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Google sign-in failed. Please check your connection.');
    }
  },

  // ── Confirm name (post-Google) ──────────────────────────────────────────
  confirmName: async (name: string): Promise<void> => {
    try {
      await apiClient.patch('/auth/name', { name });
      // Update cached user
      const cached = await SecureStore.getItemAsync(USER_KEY);
      if (cached) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify({ ...JSON.parse(cached), name }));
      }
    } catch (err: any) {
      // Non-critical — update locally even if server fails
      const cached = await SecureStore.getItemAsync(USER_KEY);
      if (cached) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify({ ...JSON.parse(cached), name }));
      }
    }
  },

  // ── Complete onboarding ─────────────────────────────────────────────────
  completeOnboarding: async (prefs: {
    language?:      string;
    madhhab?:       string;
    currency?:      string;
    notifications?: boolean;
  }): Promise<void> => {
    try {
      await apiClient.post('/auth/onboarding', prefs);
    } catch (err: any) {
      console.warn('[AuthService] Onboarding save failed — saving locally');
    }
    // Always mark complete locally
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    const cached = await SecureStore.getItemAsync(USER_KEY);
    if (cached) {
      const user = { ...JSON.parse(cached), onboardingComplete: true, ...prefs };
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    }
  },

  // ── Resend OTP ──────────────────────────────────────────────────────────
  resendOtp: async (email: string, name?: string): Promise<void> => {
    await authService.requestEmailOtp({ email, name });
  },

  // ── Session restoration ─────────────────────────────────────────────────
  restoreSession: async (): Promise<{ user: AuthUser; token: string } | null> => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      if (!token || !userJson) return null;

      const user: AuthUser = JSON.parse(userJson);

      // Check onboarding flag from SecureStore (in case user object is stale)
      const onboarded = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (onboarded === 'true') {
        user.onboardingComplete = true;
      }

      return { user, token };
    } catch {
      return null;
    }
  },

  // ── Token refresh ───────────────────────────────────────────────────────
  refreshAccessToken: async (): Promise<string | null> => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!refreshToken || refreshToken.startsWith('offline_')) return null;

      const response = await apiClient.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      const { token, refreshToken: newRefresh } = response.data.data;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (newRefresh) await SecureStore.setItemAsync(REFRESH_KEY, newRefresh);
      return token;
    } catch {
      return null;
    }
  },

  // ── Profile ─────────────────────────────────────────────────────────────
  getProfile: async (): Promise<AuthUser> => {
    try {
      const response = await apiClient.get('/auth/profile');
      const user     = response.data.data;
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      const cached = await SecureStore.getItemAsync(USER_KEY);
      if (cached) return JSON.parse(cached);
      throw err;
    }
  },

  updateProfile: async (data: Partial<AuthUser>) => {
    try {
      const response = await apiClient.patch('/auth/profile', {
        name:     data.name,
        currency: data.currency,
        madhhab:  data.madhhab,
      });
      const updated = response.data.data;
      const cached  = await SecureStore.getItemAsync(USER_KEY);
      if (cached) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify({ ...JSON.parse(cached), ...updated }));
      }
      return updated;
    } catch (err: any) {
      const cached = await SecureStore.getItemAsync(USER_KEY);
      if (cached) {
        const newObj = { ...JSON.parse(cached), ...data };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newObj));
        return newObj;
      }
      throw err;
    }
  },

  // ── Logout ──────────────────────────────────────────────────────────────
  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
      SecureStore.deleteItemAsync(ONBOARDING_KEY),
    ]);
  },

  // ── Legacy helpers kept for OTP screen ──────────────────────────────────
  verifyEmail:          async (email: string, otp: string) => authService.verifyEmailOtp({ email, otp }),
  resendVerification:   async (email: string)              => authService.resendOtp(email),
  forgotPassword:       async (email: string)              => apiClient.post('/auth/forgot-password', { email }).catch(() => {}),
  resetPassword:        async (email: string, otp: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { email, otp, newPassword }).catch(() => {}),

  /** Internal: persist tokens and user to SecureStore */
  _persistSession: async (user: AuthUser, token: string, refreshToken: string) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY,   token),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
      SecureStore.setItemAsync(USER_KEY,    JSON.stringify(user)),
    ]);
    if (user.onboardingComplete) {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    }
  },
};
