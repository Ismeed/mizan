import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Animated, Linking, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Logo } from '../../src/components/ui/Logo';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { authSupabaseService, googleUserNeedsNameConfirmation, resolveGoogleFirstName } from '../../src/services/auth.supabase.service';
import { useAuthStore } from '../../src/stores/auth.store';

import { Platform } from 'react-native';

export default function AuthLandingScreen() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg]                 = useState<string | null>(null);

  // Subtle entrance animation
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGooglePress = async () => {
    setErrorMsg(null);

    // Requirement 7 & 8: Expo Go detection for Native only (Web browser uses redirect)
    const isExpoGo =
      Platform.OS !== 'web' &&
      (Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
       (Constants as any).appOwnership === 'expo');

    if (isExpoGo) {
      Alert.alert(
        'Expo Go Environment',
        'Google sign-in requires the MIZAN development build or Expo Web. Email OTP remains available in Expo Go.'
      );
      return;
    }

    // Requirement 2 & 3: Start Supabase Google OAuth flow
    setIsGoogleLoading(true);
    try {
      const result = await authSupabaseService.signInWithGoogle();

      // On Web, browser redirects directly
      if (Platform.OS === 'web' && !result) {
        return;
      }

      // Requirement 3 & 7: If OAuth is cancelled, dismissed, or fails — remain on screen, show error, no session created
      if (!result || !result.session || !result.user) {
        setErrorMsg('Google sign-in was cancelled or dismissed.');
        return;
      }

      // Requirement 2 & 6: Process callback, set store session, verify user exists
      useAuthStore.getState().setSession(result.session, result.profile);

      // Requirement 4 & 6: Only navigate after valid authenticated session exists
      const user = result.user;
      const needsConfirm = googleUserNeedsNameConfirmation(user);

      if (needsConfirm) {
        const proposedName = resolveGoogleFirstName(user);
        router.push({
          pathname: '/(auth)/confirm-name',
          params: { googleName: proposedName },
        });
      } else if (result.profile?.onboardingCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0A1F14', '#0D2B1A', '#0F3320']}
      style={styles.gradient}
    >
      <SafeScreen edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>

        {/* Top spacer */}
        <View style={styles.top} />

        {/* ── Brand Section ── */}
        <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Logo size={88} showText={false} />

          <Text style={styles.appName}>MIZAN</Text>
          <Text style={styles.tagline}>Justice in Every Calculation</Text>
          <Text style={styles.description}>
            Your trusted companion for Islamic inheritance,{'\n'}
            Zakat, and financial guidance.
          </Text>
        </Animated.View>

        {/* ── Auth Buttons ── */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Google Sign-In */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            onPress={handleGooglePress}
            disabled={isGoogleLoading}
          >
            <View style={styles.googleIconBg}>
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="logo-google" size={20} color="#fff" />
              )}
            </View>
            <Text style={styles.googleBtnText}>
              {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </Text>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Sign-In */}
          <TouchableOpacity
            style={styles.emailBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/email-auth')}
          >
            <Ionicons name="mail-outline" size={20} color={colors.secondary} />
            <Text style={styles.emailBtnText}>Continue with Email</Text>
          </TouchableOpacity>

        </Animated.View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://mizan.app/terms')}>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> and </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://mizan.app/privacy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex:            1,
    backgroundColor: 'transparent',
    justifyContent:  'space-between',
  },
  top: {
    flex: 1,
  },
  brand: {
    flex:         2,
    alignItems:   'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  appName: {
    fontFamily:    typography.heading,
    fontSize:      36,
    color:         colors.secondary,
    letterSpacing: 6,
    marginTop:     spacing.md,
    marginBottom:  4,
  },
  tagline: {
    fontFamily:   typography.headingMedium ?? typography.heading,
    fontSize:     15,
    color:        colors.white,
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: typography.body,
    fontSize:   14,
    color:      colors.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
  },
  actions: {
    flex:              1.5,
    paddingHorizontal: spacing.xl,
    justifyContent:    'center',
    gap:               spacing.md,
  },
  googleBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   colors.secondary,
    borderRadius:      borderRadius.lg,
    paddingVertical:   16,
    paddingHorizontal: spacing.lg,
    gap:               spacing.sm,
  },
  googleIconBg: {
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  googleBtnText: {
    flex:       1,
    fontFamily: typography.bodyBold ?? typography.bodySemiBold,
    fontSize:   16,
    color:      colors.primaryDark,
    fontWeight: '700',
  },
  recommendedBadge: {
    backgroundColor:   'rgba(0,0,0,0.18)',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      6,
  },
  recommendedText: {
    fontFamily: typography.body,
    fontSize:   10,
    color:      colors.primaryDark,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
    marginVertical: 2,
  },
  dividerLine: {
    flex:            1,
    height:          1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: typography.body,
    fontSize:   13,
    color:      colors.textMuted,
  },
  emailBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             spacing.sm,
    backgroundColor: 'transparent',
    borderRadius:    borderRadius.lg,
    paddingVertical: 16,
    borderWidth:     1.5,
    borderColor:     colors.secondary,
  },
  emailBtnText: {
    fontFamily: typography.bodySemiBold,
    fontSize:   16,
    color:      colors.secondary,
  },
  footer: {
    alignItems:        'center',
    paddingHorizontal: spacing.xl,
    paddingBottom:     spacing.lg,
    paddingTop:        spacing.md,
  },
  footerText: {
    fontFamily: typography.body,
    fontSize:   11,
    color:      colors.textMuted,
    textAlign:  'center',
  },
  footerLinks: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },
  footerLink: {
    fontFamily: typography.bodySemiBold,
    fontSize:   11,
    color:      colors.secondary,
  },
  errorBox: {
    backgroundColor: 'rgba(127,29,29,0.35)',
    borderWidth:     1,
    borderColor:     '#7F1D1D',
    padding:         spacing.sm,
    borderRadius:    borderRadius.sm,
    marginBottom:    spacing.xs,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize:   13,
    color:      '#F87171',
    textAlign:  'center',
  },
});
