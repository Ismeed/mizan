import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Animated, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Logo } from '../../src/components/ui/Logo';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';

export default function AuthLandingScreen() {
  const router = useRouter();

  // Subtle entrance animation
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

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

          {/* Google Sign-In */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/confirm-name')}
            // NOTE: In production, wire this to expo-auth-session Google flow
            // For now navigates to confirm-name with a placeholder — Google ID token
            // would be passed via params after OAuth completes
          >
            <View style={styles.googleIconBg}>
              <Ionicons name="logo-google" size={20} color="#fff" />
            </View>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
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
});
