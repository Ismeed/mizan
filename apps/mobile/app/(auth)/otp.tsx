import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Clipboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';
import { useAuthStore } from '../../src/stores/auth.store';

const OTP_LENGTH  = 6;
const RESEND_WAIT = 60; // seconds

export default function OTPScreen() {
  const router = useRouter();
  const { email, name, purpose } = useLocalSearchParams<{
    email: string; name?: string; purpose?: string;
  }>();
  const { verifyOtp, forgotPassword, resetPassword, isLoading, error } = useAuth();
  const { onboardingComplete } = useAuthStore();
  // Note: navigation after OTP goes through splash screen, not directly to tabs

  const [otp,            setOtp]            = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown,      setCountdown]      = useState(RESEND_WAIT);
  const [canResend,      setCanResend]      = useState(false);
  const [successAnim,    setSuccessAnim]    = useState(false);
  const [newPassword,    setNewPassword]    = useState('');
  const [showPwdStep,    setShowPwdStep]    = useState(false);
  const inputRefs   = useRef<(TextInput | null)[]>([]);
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  const isReset   = purpose === 'reset';
  const otpString = otp.join('');
  const isComplete = otpString.length === OTP_LENGTH && !otp.includes('');

  // Auto-focus first box
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const playSuccess = useCallback(() => {
    setSuccessAnim(true);
    Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 80 }).start();
  }, [successScale]);

  const handleInput = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
    }
  };

  // Paste support
  const handlePaste = async () => {
    try {
      const text   = await Clipboard.getString();
      const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const filled = [...Array(OTP_LENGTH).fill('')];
      digits.forEach((d, i) => { filled[i] = d; });
      setOtp(filled);
      if (digits.length > 0) {
        inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
      }
    } catch {}
  };

  const handleVerify = async () => {
    if (!isComplete) { shake(); return; }

    if (isReset) {
      if (!showPwdStep) { setShowPwdStep(true); return; }
      if (!newPassword || newPassword.length < 8) { shake(); return; }
      const ok = await resetPassword(email, otpString, newPassword);
      if (ok) {
        playSuccess();
        setTimeout(() => router.replace('/(auth)/index'), 1500);
      } else shake();
    } else {
      const ok = await verifyOtp(email, otpString);
      if (ok) {
        playSuccess();
        // Navigate to splash which then transitions to Dashboard
        // AuthGuard will route to onboarding if needed
        setTimeout(() => {
          router.replace('/(auth)/splash');
        }, 1000);
      } else {
        shake();
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_WAIT);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();

    const { authService } = await import('../../src/services/auth.service');
    if (isReset) {
      await forgotPassword(email);
    } else {
      await authService.resendOtp(email, name);
    }
  };

  // Success overlay
  if (successAnim) {
    return (
      <LinearGradient colors={['#0A1F14', '#0D2B1A']} style={styles.gradient}>
        <View style={styles.successScreen}>
          <Animated.View style={[styles.successCircle, { transform: [{ scale: successScale }] }]}>
            <Ionicons name="checkmark" size={52} color={colors.primaryDark} />
          </Animated.View>
          <Text style={styles.successTitle}>Verified!</Text>
          <Text style={styles.successSub}>Welcome to MIZAN</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A1F14', '#0D2B1A', '#0F3320']} style={styles.gradient}>
      <SafeScreen edges={['top', 'bottom', 'left', 'right']} style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>

            {/* Back */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconCircle}>
              <Ionicons
                name={isReset ? 'lock-open-outline' : 'mail-outline'}
                size={32}
                color={colors.secondary}
              />
            </View>

            <Text style={styles.title}>
              {showPwdStep ? 'Set New Password' : 'Check Your Email'}
            </Text>
            <Text style={styles.subtitle}>
              {showPwdStep
                ? 'Enter a new secure password for your account.'
                : `We sent a 6-digit code to\n${email}`}
            </Text>

            {!showPwdStep ? (
              <>
                {/* OTP Boxes */}
                <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
                  {Array(OTP_LENGTH).fill(0).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={1}
                      onLongPress={i === 0 ? handlePaste : undefined}
                    >
                      <TextInput
                        ref={ref => { inputRefs.current[i] = ref; }}
                        style={[
                          styles.otpBox,
                          otp[i] ? styles.otpBoxFilled : {},
                          error   ? styles.otpBoxError : {},
                        ]}
                        value={otp[i]}
                        onChangeText={(v) => handleInput(v, i)}
                        onKeyPress={(e)  => handleKeyPress(e, i)}
                        keyboardType="numeric"
                        maxLength={1}
                        selectTextOnFocus
                        textAlign="center"
                      />
                    </TouchableOpacity>
                  ))}
                </Animated.View>

                {/* Paste hint */}
                <TouchableOpacity onPress={handlePaste} style={styles.pasteBtn}>
                  <Ionicons name="clipboard-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.pasteText}>Paste code</Text>
                </TouchableOpacity>

                {/* Error */}
                {error ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Countdown / Resend */}
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={!canResend}
                  style={styles.resendBtn}
                >
                  {canResend ? (
                    <Text style={styles.resendActive}>Resend Code</Text>
                  ) : (
                    <Text style={styles.resendCountdown}>
                      Resend in{' '}
                      <Text style={{ color: colors.secondary }}>{countdown}s</Text>
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.pwdField}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.pwdInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password (min 8 characters)"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoFocus
                />
              </View>
            )}

            <Button
              title={showPwdStep ? 'Reset Password' : 'Verify Code'}
              onPress={handleVerify}
              disabled={(!isComplete && !showPwdStep) || isLoading}
              loading={isLoading}
              style={styles.verifyBtn}
            />

          </View>
        </KeyboardAvoidingView>
      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex:            1,
    padding:         spacing.xl,
    alignItems:      'center',
    justifyContent:  'center',
  },
  backBtn: {
    position: 'absolute',
    top:      spacing.lg,
    left:     spacing.md,
    padding:  spacing.sm,
  },
  iconCircle: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: 'rgba(201,168,76,0.12)',
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    spacing.lg,
    borderWidth:     1,
    borderColor:     'rgba(201,168,76,0.3)',
  },
  title: {
    fontFamily:   typography.heading,
    fontSize:     26,
    color:        colors.white,
    textAlign:    'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily:   typography.body,
    fontSize:     14,
    color:        colors.textSecondary,
    textAlign:    'center',
    lineHeight:   22,
    marginBottom: spacing.xl,
  },
  otpRow: {
    flexDirection: 'row',
    gap:           spacing.sm,
    marginBottom:  spacing.sm,
  },
  otpBox: {
    width:           46,
    height:          58,
    backgroundColor: colors.surface,
    borderRadius:    borderRadius.md,
    borderWidth:     1.5,
    borderColor:     colors.border,
    color:           colors.white,
    fontSize:        24,
    fontFamily:      typography.bodyBold ?? typography.bodySemiBold,
  },
  otpBoxFilled: {
    borderColor:     colors.secondary,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  otpBoxError: {
    borderColor: '#F87171',
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
    marginBottom:  spacing.md,
    paddingVertical: 4,
  },
  pasteText: {
    fontFamily: typography.body,
    fontSize:   12,
    color:      colors.textMuted,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.xs,
    marginBottom:  spacing.md,
    backgroundColor: 'rgba(127,29,29,0.35)',
    padding:       spacing.sm,
    borderRadius:  borderRadius.sm,
    borderWidth:   1,
    borderColor:   '#7F1D1D',
  },
  errorText: {
    fontFamily: typography.body,
    fontSize:   13,
    color:      '#F87171',
  },
  resendBtn:    { marginBottom: spacing.xl },
  resendActive: {
    fontFamily: typography.bodySemiBold,
    fontSize:   14,
    color:      colors.secondary,
  },
  resendCountdown: {
    fontFamily: typography.body,
    fontSize:   14,
    color:      colors.textMuted,
  },
  pwdField: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   colors.surface,
    borderRadius:      borderRadius.md,
    borderWidth:       1,
    borderColor:       colors.border,
    paddingHorizontal: spacing.md,
    marginBottom:      spacing.lg,
    width:             '100%',
  },
  pwdInput: {
    flex:       1,
    height:     52,
    color:      colors.white,
    fontFamily: typography.body,
    fontSize:   16,
    marginLeft: spacing.sm,
  },
  verifyBtn: { width: '100%' },
  // Success
  successScreen: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            spacing.lg,
  },
  successCircle: {
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: colors.secondary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  successTitle: {
    fontFamily: typography.heading,
    fontSize:   28,
    color:      colors.white,
  },
  successSub: {
    fontFamily: typography.body,
    fontSize:   15,
    color:      colors.textSecondary,
  },
});
