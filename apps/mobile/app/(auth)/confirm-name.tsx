import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Logo } from '../../src/components/ui/Logo';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';
import { useAuthStore } from '../../src/stores/auth.store';
import { resolveGoogleFirstName, resolveGoogleFullName } from '../../src/services/auth.supabase.service';
import { profileService } from '../../src/services/profile.service';

export default function ConfirmNameScreen() {
  const router = useRouter();
  const { googleName } = useLocalSearchParams<{ googleName?: string }>();

  const { confirmName, isLoading, error } = useAuth();
  const { session, user, profile }        = useAuthStore();

  // Requirement 4: Route Protection — Require an authenticated Supabase session & user
  useEffect(() => {
    if (!session || !user) {
      router.replace('/(auth)');
    }
  }, [session, user]);

  // Requirement 5: Resolve proposed initial name (Google full name/first name → params → profile)
  const resolvedInitial =
    googleName ||
    resolveGoogleFullName(user) ||
    resolveGoogleFirstName(user) ||
    profile?.displayName ||
    profile?.firstName ||
    '';

  const [name, setName]             = useState(resolvedInitial);
  const [localError, setLocalError] = useState<string | null>(null);

  // Sync state if user loads after mount
  useEffect(() => {
    if (user && !name) {
      const best = googleName || resolveGoogleFullName(user) || resolveGoogleFirstName(user) || '';
      if (best) setName(best);
    }
  }, [user, googleName]);

  if (!session || !user) {
    return null; // Suppress rendering if unauthenticated; route guard redirects to /(auth)
  }

  // Requirement 6: Save confirmed name (first name & surname) and proceed to preference onboarding
  const handleContinue = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setLocalError('Please enter your first name (at least 2 characters).');
      return;
    }
    setLocalError(null);

    try {
      const parts     = trimmed.split(' ');
      const firstName = parts[0] || '';
      const surname   = parts.slice(1).join(' ') || '';

      const updatedProfile = await profileService.updateNames(firstName, surname);
      if (updatedProfile) {
        useAuthStore.getState().setProfile(updatedProfile);
      } else {
        await confirmName(trimmed);
      }
      router.replace('/(auth)/onboarding');
    } catch (err: any) {
      setLocalError(err?.message ?? 'Failed to save name. Please try again.');
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
            {/* Brand */}
            <View style={styles.brand}>
              <Logo size={64} showText={false} />
              <Text style={styles.welcome}>Welcome to MIZAN</Text>
              <Text style={styles.subtext}>
                We use your name for greetings, reports,{'\n'}
                notifications, and personalised experiences.
              </Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Confirm Your Name</Text>

              {(localError ?? error) ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{localError ?? error}</Text>
                </View>
              ) : null}

              <Input
                label="Full Name"
                value={name}
                onChangeText={(v) => { setName(v); setLocalError(null); }}
                placeholder="e.g. Muhammad Ibrahim"
                autoCapitalize="words"
                autoFocus={!googleName}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />

              <Text style={styles.hint}>
                You can update this later in Profile Settings.
              </Text>

              <Button
                title="Continue"
                onPress={handleContinue}
                loading={isLoading}
                style={styles.continueBtn}
              />
            </View>

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
    paddingTop:        spacing.xxl,
    paddingBottom:     spacing.xxl,
  },
  brand: {
    alignItems:   'center',
    marginBottom: spacing.xxl,
  },
  welcome: {
    fontFamily:   typography.heading,
    fontSize:     26,
    color:        colors.white,
    marginTop:    spacing.lg,
    marginBottom: spacing.sm,
    textAlign:    'center',
  },
  subtext: {
    fontFamily: typography.body,
    fontSize:   14,
    color:      colors.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(15,45,25,0.7)',
    borderRadius:    borderRadius.xl ?? 20,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         spacing.lg,
  },
  cardLabel: {
    fontFamily:   typography.bodySemiBold,
    fontSize:     13,
    color:        colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  errorBox: {
    backgroundColor: 'rgba(127,29,29,0.35)',
    borderWidth:    1,
    borderColor:    '#7F1D1D',
    padding:        spacing.sm,
    borderRadius:   borderRadius.sm,
    marginBottom:   spacing.md,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize:   13,
    color:      '#F87171',
  },
  hint: {
    fontFamily:  typography.body,
    fontSize:    12,
    color:       colors.textMuted,
    marginTop:   spacing.sm,
    marginBottom: spacing.lg,
    textAlign:   'center',
  },
  continueBtn: { marginTop: 2 },
});
