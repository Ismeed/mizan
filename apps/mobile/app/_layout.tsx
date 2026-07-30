import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../src/constants/colors';
import { useAuthStore } from '../src/stores/auth.store';
import { authService } from '../src/services/auth.service';

// Prevent auto hiding of splash screen
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Auth Guard — handles:
 * 1. Unauthenticated → auth landing
 * 2. Authenticated + onboarding incomplete → onboarding
 * 3. Authenticated + onboarding complete → home (no interruption)
 */
function AuthGuard() {
  const segments  = useSegments();
  const router    = useRouter();
  const { token, onboardingComplete } = useAuthStore();

  const segmentKey = (segments as string[]).join('/');

  useEffect(() => {
    const segs         = (segments as string[]) || [];
    const inAuth       = segs[0] === '(auth)';
    const inOnboarding = segs[0] === '(auth)' && segs[1] === 'onboarding';

    if (!token && !inAuth) {
      // Not logged in → auth landing
      router.replace('/(auth)');
      return;
    }

    if (token && inAuth && !inOnboarding) {
      // Logged in but on auth screen → check onboarding
      if (!onboardingComplete) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    if (token && !inAuth && !onboardingComplete) {
      // Logged in, not on auth, but onboarding pending
      router.replace('/(auth)/onboarding');
    }
  }, [token, segmentKey, onboardingComplete]);

  return null;
}

export default function RootLayout() {
  const { setAuth } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  // Restore persisted session on startup
  useEffect(() => {
    let mounted = true;
    authService.restoreSession()
      .then((session) => {
        if (mounted && session) {
          setAuth(session.user as any, session.token);
        }
      })
      .catch((err) => {
        console.warn('[RootLayout] Session restore error:', err);
      })
      .finally(() => {
        if (mounted) {
          setAppReady(true);
          SplashScreen.hideAsync().catch(() => {});
        }
      });

    return () => { mounted = false; };
  }, []);

  if (!appReady) {
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

  const sharedScreenOptions = {
    headerShown:       false,
    contentStyle:      { backgroundColor: colors.background },
    animation:         Platform.OS === 'android' ? 'fade' as const : 'default' as const,
    animationDuration: 220,
  };

  return (
    <ThemeProvider value={customTheme}>
      <AuthGuard />
      <Stack screenOptions={sharedScreenOptions}>
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
