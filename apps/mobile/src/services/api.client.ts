/**
 * MIZAN API Client — Controlled Authentication Interceptors
 *
 * Response error handling rules:
 *   400  Validation/bad request   → reject, keep session
 *   401  Unauthorized             → attempt ONE token refresh, then retry
 *   403  Permission denied        → reject, keep session
 *   404  Not found                → reject, keep session
 *   409  Conflict                 → reject, keep session
 *   422  Validation failure       → reject, keep session
 *   429  Rate limited             → reject, keep session
 *   5xx  Server error             → reject, keep session
 *   Net  Network/timeout error    → reject, keep session
 *
 * 401 handling (single-flight refresh):
 *   1. Pause the failing request.
 *   2. If a refresh is already running, queue behind it.
 *   3. Call authService.refreshAccessToken().
 *   4. On success: update the store + SecureStore, retry original request.
 *   5. On failure: call revokeSession() ONCE — do NOT loop.
 *
 * CRITICAL: NEVER call logout() or revokeSession() for 400, 403, 404,
 * 409, 422, 429, 5xx, or network errors. Those are feature-level errors.
 */
import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';
import { useAuthStore } from '../stores/auth.store';
import { getAccessToken } from '../lib/supabase';

// ── Singleton axios instance ─────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Refresh state (single-flight lock) ──────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(newToken: string | null) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

// ── Request interceptor — attach access token ────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Try in-memory store token
    let token = useAuthStore.getState().accessToken;

    // 2. Try Supabase session token
    if (!token) {
      token = await getAccessToken();
    }

    // 3. Fallback to SecureStore
    if (!token) {
      token = await SecureStore.getItemAsync('auth_token');
    }

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — classify errors, controlled refresh ───────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _isRefreshRequest?: boolean;
    };

    const status = error.response?.status;

    // ── Non-401 errors: NEVER touch authentication ───────────────────────
    if (!status) {
      // Network error / timeout
      console.warn('[APIClient] FEATURE_ERROR_SESSION_PRESERVED: network error');
      return Promise.reject(error);
    }

    if (status !== 401) {
      // 400, 403, 404, 409, 422, 429, 5xx — feature errors, session stays
      console.warn(
        `[APIClient] FEATURE_ERROR_SESSION_PRESERVED: HTTP ${status} on ${originalRequest?.url}`
      );
      return Promise.reject(error);
    }

    // ── 401 handling ─────────────────────────────────────────────────────
    // Skip refresh for auth endpoints themselves
    const url = (originalRequest?.url ?? '') as string;
    const isPublicAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/email-otp') ||
      url.includes('/auth/google') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    if (isPublicAuthRoute) {
      return Promise.reject(error);
    }

    // If this request already retried (after refresh), do not loop
    if (originalRequest._retry) {
      console.warn('[APIClient] AUTH_REFRESH_FAILED: retry already attempted, revoking session');
      useAuthStore.getState().revokeSession();
      // Clear SecureStore tokens
      await Promise.all([
        SecureStore.deleteItemAsync('auth_token'),
        SecureStore.deleteItemAsync('refresh_token'),
      ]).catch(() => {});
      return Promise.reject(error);
    }

    // If refresh request itself returned 401, revoke
    if (originalRequest._isRefreshRequest) {
      console.warn('[APIClient] AUTH_REFRESH_FAILED: refresh token rejected, revoking session');
      useAuthStore.getState().revokeSession();
      await Promise.all([
        SecureStore.deleteItemAsync('auth_token'),
        SecureStore.deleteItemAsync('refresh_token'),
      ]).catch(() => {});
      return Promise.reject(error);
    }

    // ── Single-flight refresh ─────────────────────────────────────────────
    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken) => {
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;
    console.log('[APIClient] AUTH_REFRESH_STARTED');
    useAuthStore.getState().setStatus('REFRESHING_SESSION');

    try {
      // Import authService lazily to avoid circular deps
      const { authService } = await import('../services/auth.service');
      const newToken = await authService.refreshAccessToken();

      if (!newToken) {
        throw new Error('Refresh returned null token');
      }

      // Update in-memory store with new token
      useAuthStore.getState().setAccessToken(newToken);

      console.log('[APIClient] AUTH_REFRESH_SUCCEEDED');
      processQueue(newToken);

      // Retry original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.warn('[APIClient] AUTH_REFRESH_FAILED: revoking session');
      processQueue(null);
      useAuthStore.getState().revokeSession();
      await Promise.all([
        SecureStore.deleteItemAsync('auth_token'),
        SecureStore.deleteItemAsync('refresh_token'),
      ]).catch(() => {});
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
