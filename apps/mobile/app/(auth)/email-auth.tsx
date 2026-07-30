import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Logo } from '../../src/components/ui/Logo';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAuthScreen() {
  const router = useRouter();
  const { requestOtp, isLoading } = useAuth();

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!name.trim() || name.trim().length < 2) return 'Please enter your full name (at least 2 characters).';
    if (!email.trim())                           return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(email.trim()))         return 'Please enter a valid email address.';
    return null;
  };

  const handleSendCode = async () => {
    const err = validate();
    if (err) { setLocalError(err); return; }
    setLocalError(null);

    const ok = await requestOtp(email.trim().toLowerCase(), name.trim());
    if (ok) {
      router.push({
        pathname: '/(auth)/otp',
        params:   { email: email.trim().toLowerCase(), name: name.trim() },
      });
    } else {
      setLocalError('Failed to send verification code. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#0A1F14', '#0D2B1A', '#0F3320']} style={styles.gradient}>
      <SafeScreen edges={['top', 'bottom', 'left', 'right']} style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>

            {/* Brand */}
            <View style={styles.brand}>
              <Logo size={56} showText={false} />
              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subheading}>
                Enter your name and email to receive{'\n'}a verification code.
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {localError ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#F87171" />
                  <Text style={styles.errorText}>{localError}</Text>
                </View>
              ) : null}

              <Input
                label="Full Name"
                value={name}
                onChangeText={(v) => { setName(v); setLocalError(null); }}
                placeholder="e.g. Muhammad Ibrahim"
                autoCapitalize="words"
                returnKeyType="next"
              />

              <View style={styles.fieldGap} />

              <Input
                label="Email Address"
                value={email}
                onChangeText={(v) => { setEmail(v); setLocalError(null); }}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSendCode}
              />

              <View style={styles.infoBox}>
                <Ionicons name="shield-checkmark-outline" size={14} color={colors.secondary} />
                <Text style={styles.infoText}>
                  No password needed. We'll send a secure 6-digit code to verify your identity.
                </Text>
              </View>

              <Button
                title="Send Verification Code"
                onPress={handleSendCode}
                loading={isLoading}
                style={styles.sendBtn}
              />
            </View>

            {/* Footer link */}
            <TouchableOpacity style={styles.footerRow} onPress={() => router.back()}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, backgroundColor: 'transparent' },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.xxl,
  },
  backBtn: {
    alignSelf:  'flex-start',
    padding:    spacing.sm,
    marginLeft: -spacing.xs,
    marginTop:  spacing.xs,
  },
  brand: {
    alignItems:   'center',
    marginTop:    spacing.lg,
    marginBottom: spacing.xl,
  },
  heading: {
    fontFamily:   typography.heading,
    fontSize:     26,
    color:        colors.white,
    marginTop:    spacing.md,
    marginBottom: 6,
  },
  subheading: {
    fontFamily: typography.body,
    fontSize:   14,
    color:      colors.textSecondary,
    textAlign:  'center',
    lineHeight: 21,
  },
  card: {
    backgroundColor: 'rgba(15,45,25,0.7)',
    borderRadius:    borderRadius.xl ?? 20,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         spacing.lg,
    marginBottom:    spacing.lg,
  },
  errorBox: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            8,
    backgroundColor: 'rgba(127,29,29,0.4)',
    borderWidth:    1,
    borderColor:    '#7F1D1D',
    padding:        spacing.md,
    borderRadius:   borderRadius.md,
    marginBottom:   spacing.md,
  },
  errorText: {
    flex:       1,
    fontFamily: typography.body,
    fontSize:   13,
    color:      '#F87171',
  },
  fieldGap: { height: spacing.md },
  infoBox: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    gap:            6,
    marginTop:      spacing.md,
    marginBottom:   spacing.lg,
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius:   borderRadius.md,
    padding:        spacing.sm,
    borderWidth:    1,
    borderColor:    'rgba(201,168,76,0.2)',
  },
  infoText: {
    flex:       1,
    fontFamily: typography.body,
    fontSize:   12,
    color:      colors.secondaryLight ?? colors.secondary,
    lineHeight: 18,
  },
  sendBtn: { marginTop: 2 },
  footerRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    marginTop:      spacing.md,
  },
  footerText: {
    fontFamily: typography.body,
    fontSize:   13,
    color:      colors.textMuted,
  },
  footerLink: {
    fontFamily: typography.bodySemiBold,
    fontSize:   13,
    color:      colors.secondary,
  },
});
