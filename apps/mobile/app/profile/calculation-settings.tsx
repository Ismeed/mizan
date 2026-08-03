import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useSettingsStore, MadhhabCode, CurrencyCode, LanguageCode } from '../../src/stores/settings.store';
import { usePreferencesStore } from '../../src/stores/preferences.store';

const MADHHAB_OPTIONS: { code: MadhhabCode; label: string; desc: string }[] = [
  { code: 'MALIKI', label: 'Maliki School', desc: 'Prevalent in North & West Africa' },
  { code: 'HANAFI', label: 'Hanafi School', desc: 'Prevalent in South Asia, Turkey & Levant' },
  { code: 'SHAFII', label: 'Shafi\'i School', desc: 'Prevalent in East Africa & SE Asia' },
  { code: 'HANBALI', label: 'Hanbali School', desc: 'Prevalent in Arabian Peninsula' },
  { code: 'JAFARI', label: 'Ja\'fari School', desc: 'Followed by Ithna Ashari school' },
];

const CURRENCY_OPTIONS: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
];

const LANGUAGE_OPTIONS: { tag: LanguageCode; label: string }[] = [
  { tag: 'en', label: 'English' },
  { tag: 'ha', label: 'Hausa' },
  { tag: 'ar', label: 'العربية (Arabic)' },
];

export default function CalculationSettingsScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const preferences = usePreferencesStore();

  const [selectedMadhhab, setSelectedMadhhab] = useState<MadhhabCode>(preferences.overrideMadhhab || settings.madhhab);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>( (preferences.overrideCurrency || settings.currency) as CurrencyCode );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>( (preferences.overrideLanguage || settings.language) as LanguageCode );

  const handleApplyOnce = () => {
    preferences.setOverrideMadhhab(selectedMadhhab);
    preferences.setOverrideCurrency(selectedCurrency);
    preferences.setOverrideLanguage(selectedLanguage);
    router.back();
  };

  const handleSaveAsDefault = async () => {
    await settings.setMadhhab(selectedMadhhab);
    await settings.setCurrency(selectedCurrency);
    await settings.setLanguage(selectedLanguage);
    preferences.clearOverrides();
    router.back();
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Calculation Settings Override" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Select School of Thought (Madhhab)</Text>
        {MADHHAB_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item.code}
            style={[styles.optionCard, selectedMadhhab === item.code && styles.optionCardSelected]}
            onPress={() => setSelectedMadhhab(item.code)}
          >
            <View>
              <Text style={styles.optionTitle}>{item.label}</Text>
              <Text style={styles.optionDesc}>{item.desc}</Text>
            </View>
            {selectedMadhhab === item.code && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionHeader}>Select Currency</Text>
        <View style={styles.grid}>
          {CURRENCY_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[styles.gridCard, selectedCurrency === item.code && styles.gridCardSelected]}
              onPress={() => setSelectedCurrency(item.code)}
            >
              <Text style={styles.gridSymbol}>{item.symbol}</Text>
              <Text style={styles.gridCode}>{item.code}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Select Language</Text>
        {LANGUAGE_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item.tag}
            style={[styles.optionCard, selectedLanguage === item.tag && styles.optionCardSelected]}
            onPress={() => setSelectedLanguage(item.tag)}
          >
            <Text style={styles.optionTitle}>{item.label}</Text>
            {selectedLanguage === item.tag && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}

        <View style={styles.buttonContainer}>
          <Button title="Use for this calculation only" onPress={handleApplyOnce} />
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveAsDefault}>
            <Text style={styles.secondaryButtonText}>Save as my default preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontFamily: typography.headingMedium,
    fontSize: 16,
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  optionTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: colors.white,
  },
  optionDesc: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  gridCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gridCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  gridSymbol: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  gridCode: {
    fontSize: 12,
    color: colors.white,
    fontFamily: typography.bodySemiBold,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
