import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { useSettingsStore } from '../../stores/settings.store';
import { usePreferencesStore } from '../../stores/preferences.store';

interface Props {
  moduleName: 'MIRATH' | 'ZAKAT';
  onChangeRequested?: () => void;
}

export const CalculationProfileBanner: React.FC<Props> = ({ moduleName, onChangeRequested }) => {
  const { madhhab, currency, language } = useSettingsStore();
  const { overrideMadhhab, overrideCurrency, overrideLanguage } = usePreferencesStore();

  const effectiveMadhhab = overrideMadhhab || madhhab;
  const effectiveCurrency = overrideCurrency || currency;
  const effectiveLanguage = overrideLanguage || language;

  const isOverrideActive = !!(overrideMadhhab || overrideCurrency || overrideLanguage);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Calculation Settings</Text>
        {isOverrideActive && (
          <View style={styles.overrideBadge}>
            <Text style={styles.overrideBadgeText}>Calculation Override Active</Text>
          </View>
        )}
      </View>

      <View style={styles.settingsGrid}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Madhhab</Text>
          <Text style={styles.settingValue}>{effectiveMadhhab}</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Currency</Text>
          <Text style={styles.settingValue}>{effectiveCurrency}</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.settingValue}>{effectiveLanguage.toUpperCase()}</Text>
        </View>
      </View>

      {onChangeRequested && (
        <TouchableOpacity style={styles.changeButton} onPress={onChangeRequested} activeOpacity={0.8}>
          <Text style={styles.changeButtonText}>Change for this calculation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.headingMedium,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  overrideBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overrideBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: typography.bodySemiBold,
  },
  settingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  settingItem: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.body,
  },
  settingValue: {
    fontSize: 13,
    color: colors.white,
    fontFamily: typography.bodySemiBold,
    marginTop: 2,
  },
  changeButton: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  changeButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.bodySemiBold,
    textDecorationLine: 'underline',
  },
});
