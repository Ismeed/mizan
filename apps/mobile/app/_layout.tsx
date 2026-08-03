/**
 * MIZAN Root Layout — Supabase Session Hydration + Hydration-Gated Auth Guard
 *
 * Session Hydration:
 *   1. On mount: call authSupabaseService.restoreSession() from Supabase AsyncStorage.
 *   2. Subscribe to supabase.auth.onAuthStateChange() for live session changes.
 *   3. Mark isHydrated = true after the first restore attempt.
 *   4. Hide the native splash screen.
 *
 * Auth Guard rules (evaluated only after isHydrated === true):
 *   UNAUTHENTICATED | SESSION_REVOKED → redirect to /(auth)
 *   ONBOARDING_REQUIRED              → redirect to /(auth)/onboarding
 *   AUTHENTICATED + on auth screen   → redirect to /(tabs)
 *   INITIALIZING or !isHydrated      → show loading, suppress redirect
 *
 * CRITICAL: Guard never redirects before isHydrated is true.
 * This prevents the "Signup flash" for returning authenticated users.
 *
 * Provider order (stable — preference changes must NEVER remount AuthGuard):
 *   RootLayout → AuthGuard (singleton) → Stack
 * Preferences live in a separate store that AuthGuard does NOT depend on.
 */
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../src/constants/colors';
import { useAuthStore } from '../src/stores/auth.store';
import { authSupabaseService } from '../src/services/auth.supabase.service';
import { supabase } from '../src/lib/supabase';
import { profileService } from '../src/services/profile.service';

SplashScreen.preventAutoHideAsync().catch(() => {});

// ── AuthGuard — singleton route guard ─────────────────────────────────────────

function AuthGuard() {
  const router   = useRouter();
  const segments = useSegments();
  const { status, isHydrated, onboardingComplete } = useAuthStore();

  const segsKey = (segments as string[]).join('/');

  useEffect(() => {
    // ── Gate 1: Never act before hydration is complete ─────────────────────
    if (!isHydrated) {
      return;
    }

    const segs         = (segments as string[]) ?? [];
    const inAuth       = segs[0] === '(auth)';
    const inOnboarding = inAuth && segs[1] === 'onboarding';
    const inSplash     = inAuth && segs[1] === 'splash';

    // ── Gate 2: Unauthenticated → auth landing ─────────────────────────────
    if (status === 'UNAUTHENTICATED' || status === 'SESSION_REVOKED') {
      if (!inAuth) {
        router.replace('/(auth)');
      }
      return;
    }

    // ── Gate 3: Onboarding required ────────────────────────────────────────
    if (status === 'ONBOARDING_REQUIRED' || (status === 'AUTHENTICATED' && !onboardingComplete)) {
      if (!inOnboarding && !inSplash) {
        router.replace('/(auth)/onboarding');
      }
      return;
    }

    // ── Gate 4: Authenticated user on an auth screen → tabs ───────────────
    if (status === 'AUTHENTICATED' && onboardingComplete && inAuth && !inSplash) {
      router.replace('/(tabs)');
    }
  }, [status, isHydrated, segsKey, onboardingComplete]);

  return null;
}

// ── RootLayout ────────────────────────────────────────────────────────────────

export default function RootLayout() {
  const { setSession, logout, setHydrated, setProfile, revokeSession } = useAuthStore();
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // ── Step 1: Restore persisted session on startup ──────────────────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const result = await authSupabaseService.restoreSession();
        if (!mounted) return;

        if (result) {
          setSession(result.session, result.profile);
        } else {
          logout();
        }
      } catch {
        if (mounted) logout();
      } finally {
        if (mounted) {
          setHydrated();
          SplashScreen.hideAsync().catch(() => {});
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  // ── Step 2: Subscribe to live Supabase auth state changes ─────────────────
  // This handles token refresh, session expiry, and sign-in from other tabs.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          useAuthStore.getState().logout();
          return;
        }

        if (event === 'TOKEN_REFRESHED' && session) {
          // Update token without changing other state
          useAuthStore.setState({
            session,
            accessToken: session.access_token,
            status: 'AUTHENTICATED',
          });
          return;
        }

        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
          // Load or reload profile after sign-in events
          try {
            const profile = await profileService.getCurrentProfile();
            useAuthStore.getState().setSession(session, profile);
          } catch {
            useAuthStore.getState().setSession(session, null);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show loading UI while hydrating
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  const customTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary:      colors.primary,
      background:   colors.background,
      card:         colors.background,
      text:         colors.white,
      border:       colors.border,
      notification: colors.secondary,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <AuthGuard />
      <Stack
        screenOptions={{
          headerShown:  false,
          contentStyle: { backgroundColor: colors.background },
          animation:    Platform.OS === 'android' ? 'fade' : 'default',
        }}
      >
        <Stack.Screen name="(auth)"        options={{ animation: Platform.OS === 'android' ? 'fade' : 'default' }} />
        <Stack.Screen name="(tabs)"        options={{ animation: 'none' }} />
        <Stack.Screen name="inheritance"   options={{ animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right' }} />
        <Stack.Screen name="zakat"         options={{ animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right' }} />
        <Stack.Screen name="help"          options={{ animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
