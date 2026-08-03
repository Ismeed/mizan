import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';

const { width } = Dimensions.get('window');

// ── Step data ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    id:      'language',
    title:   'Choose Language',
    icon:    'globe-outline' as const,
    desc:    'Select your preferred language for MIZAN.',
    options: [
      { label: 'English',  value: 'en', flag: '🇬🇧' },
      { label: 'عربية',    value: 'ar', flag: '🇸🇦' },
      { label: 'Hausa',    value: 'ha', flag: '🇳🇬' },
      { label: 'Français', value: 'fr', flag: '🇫🇷' },
      { label: 'Swahili',  value: 'sw', flag: '🇰🇪' },
    ],
  },
  {
    id:      'madhhab',
    title:   'Preferred Madhhab',
    icon:    'book-outline' as const,
    desc:    'Select your school of Islamic jurisprudence for calculations.',
    options: [
      { label: 'Hanafi',   value: 'HANAFI',  flag: '📘' },
      { label: 'Maliki',   value: 'MALIKI',  flag: '📗' },
      { label: "Shafi'i",  value: 'SHAFII',  flag: '📙' },
      { label: 'Hanbali',  value: 'HANBALI', flag: '📕' },
      { label: "Ja'fari",  value: 'JAFARI',  flag: '📓' },
    ],
  },
  {
    id:      'currency',
    title:   'Default Currency',
    icon:    'cash-outline' as const,
    desc:    'All calculations will use this currency by default.',
    options: [
      { label: 'NGN — Nigerian Naira',        value: 'NGN', flag: '₦' },
      { label: 'USD — US Dollar',             value: 'USD', flag: '$' },
      { label: 'GBP — British Pound',         value: 'GBP', flag: '£' },
      { label: 'EUR — Euro',                  value: 'EUR', flag: '€' },
      { label: 'SAR — Saudi Riyal',           value: 'SAR', flag: '﷼' },
      { label: 'AED — UAE Dirham',            value: 'AED', flag: 'د.إ' },
    ],
  },
  {
    id:      'notifications',
    title:   'Stay Reminded',
    icon:    'notifications-outline' as const,
    desc:    'Get helpful Zakat and prayer time reminders throughout the year.',
    options: [
      { label: 'Enable Notifications', value: 'yes',  flag: '🔔' },
      { label: 'Maybe Later',          value: 'later', flag: '🔕' },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, isLoading } = useAuth();

  const [step,          setStep]      = useState(0);
  const [selections,    setSelections] = useState<Record<string, string>>({
    language: 'en', madhhab: 'MALIKI', currency: 'NGN', notifications: 'yes',
  });
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentStep = STEPS[step];
  const isLast      = step === STEPS.length - 1;

  const animateNext = (dir: 1 | -1) => {
    Animated.timing(slideAnim, {
      toValue:         dir * -width,
      duration:        260,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(dir * width);
      Animated.timing(slideAnim, {
        toValue:         0,
        duration:        260,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSelect = (value: string) => {
    setSelections(prev => ({ ...prev, [currentStep.id]: value }));
  };

  const handleNext = () => {
    if (!isLast) {
      animateNext(1);
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    if (!isLast) {
      animateNext(1);
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      animateNext(-1);
      setStep(s => s - 1);
    }
  };

  const handleFinish = async () => {
    await completeOnboarding({
      language:      selections.language,
      madhhab:       selections.madhhab,
      currency:      selections.currency,
      notifications: selections.notifications === 'yes',
    });
    // Navigate to transition splash — it will then navigate to Dashboard
    router.replace('/(auth)/splash');
  };

  return (
    <LinearGradient colors={['#0A1F14', '#0D2B1A', '#0F3320']} style={styles.gradient}>
      <SafeScreen edges={['top', 'bottom', 'left', 'right']} style={styles.safe}>

        {/* Header row */}
        <View style={styles.header}>
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>
          ) : <View style={styles.backBtn} />}

          <View style={styles.dotsRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Step content */}
        <Animated.View style={[styles.stepContent, { transform: [{ translateX: slideAnim }] }]}>
          {/* Step icon */}
          <View style={styles.iconCircle}>
            <Ionicons name={currentStep.icon} size={34} color={colors.secondary} />
          </View>

          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepDesc}>{currentStep.desc}</Text>

          {/* Options */}
          <ScrollView
            style={styles.optionsList}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {currentStep.options.map((opt) => {
              const selected = selections[currentStep.id] === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionCard, selected && styles.optionSelected]}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text style={styles.optionFlag}>{opt.flag}</Text>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                  {selected && (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color={colors.primaryDark} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Footer button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextBtn, isLoading && styles.nextBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.nextBtnText}>
              {isLast ? (isLoading ? 'Setting up…' : 'Finish & Enter MIZAN') : 'Continue'}
            </Text>
            {!isLoading && (
              <Ionicons name={isLast ? 'rocket-outline' : 'arrow-forward'} size={18} color={colors.primaryDark} />
            )}
          </TouchableOpacity>
        </View>

      </SafeScreen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, backgroundColor: 'transparent' },

  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop:     spacing.sm,
    paddingBottom:  spacing.sm,
  },
  backBtn: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.secondary,
    width:           24,
  },
  skipBtn:  { paddingHorizontal: spacing.xs },
  skipText: {
    fontFamily: typography.bodySemiBold,
    fontSize:   14,
    color:      colors.textMuted,
  },

  stepContent: {
    flex:              1,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
  },
  iconCircle: {
    width:           72,
    height:          72,
    borderRadius:    36,
    backgroundColor: 'rgba(201,168,76,0.12)',
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    spacing.lg,
    alignSelf:       'center',
    borderWidth:     1,
    borderColor:     'rgba(201,168,76,0.3)',
  },
  stepTitle: {
    fontFamily:   typography.heading,
    fontSize:     24,
    color:        colors.white,
    textAlign:    'center',
    marginBottom: 6,
  },
  stepDesc: {
    fontFamily:   typography.body,
    fontSize:     13,
    color:        colors.textSecondary,
    textAlign:    'center',
    lineHeight:   20,
    marginBottom: spacing.lg,
  },
  optionsList:    { flex: 1 },
  optionsContent: { gap: spacing.sm, paddingBottom: spacing.md },
  optionCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing.md,
    backgroundColor: colors.surface,
    borderRadius:    borderRadius.lg,
    padding:         spacing.md,
    borderWidth:     1.5,
    borderColor:     colors.border,
  },
  optionSelected: {
    borderColor:     colors.secondary,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  optionFlag: {
    fontSize: 20,
    width:    32,
    textAlign: 'center',
  },
  optionLabel: {
    flex:       1,
    fontFamily: typography.bodySemiBold,
    fontSize:   15,
    color:      colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.white,
  },
  checkCircle: {
    width:           24,
    height:          24,
    borderRadius:    12,
    backgroundColor: colors.secondary,
    alignItems:      'center',
    justifyContent:  'center',
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    paddingBottom:     spacing.xl,
  },
  nextBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    gap:               spacing.sm,
    backgroundColor:   colors.secondary,
    borderRadius:      borderRadius.lg,
    paddingVertical:   16,
  },
  nextBtnDisabled: { opacity: 0.7 },
  nextBtnText: {
    fontFamily: typography.bodyBold ?? typography.bodySemiBold,
    fontSize:   16,
    color:      colors.primaryDark,
    fontWeight: '700',
  },
});
