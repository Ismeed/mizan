import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isLoading, error } = useAuth();

  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    const ok = await forgotPassword(email.trim().toLowerCase());
    if (ok) setSubmitted(true);
  };

  const handleContinueToOTP = () => {
    router.push({ pathname: '/(auth)/otp', params: { email, purpose: 'reset' } });
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={32} color={colors.secondary} />
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            {submitted
              ? `We've sent a reset code to\n${email}\n\nCheck your inbox and spam folder.`
              : `No worries! Enter your email and we'll send you a reset code.`}
          </Text>

          {!submitted ? (
            <>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
              />

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                title="Send Reset Code"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={!email.trim() || isLoading}
                style={styles.btn}
              />
            </>
          ) : (
            <>
              {/* Success state */}
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                <Text style={styles.successText}>
                  Reset code sent! It expires in 10 minutes.
                </Text>
              </View>

              <Button
                title="Enter Reset Code"
                onPress={handleContinueToOTP}
                style={styles.btn}
              />

              <TouchableOpacity style={styles.resendLink} onPress={handleSubmit}>
                <Text style={styles.resendText}>Didn't receive it? Resend</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLinkText}>← Back to Sign In</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    padding: spacing.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  title: {
    fontFamily: 'Playfair_700Bold',
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.error,
  },
  btn: {
    width: '100%',
    marginTop: spacing.md,
  },
  successBox: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  successText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  resendLink: {
    marginTop: spacing.lg,
  },
  resendText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.secondary,
  },
  loginLink: {
    marginTop: spacing.xl,
  },
  loginLinkText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.textSecondary,
  },
});
