import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { StepIndicator } from '../../src/components/ui/StepIndicator';
import { Button } from '../../src/components/ui/Button';
import { EstateField } from '../../src/components/inheritance/EstateField';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useInheritance } from '../../src/hooks/useInheritance';
import { getCurrencySymbol } from '../../src/utils/currency.utils';

import { CalculationProfileBanner } from '../../src/components/profile/CalculationProfileBanner';

export default function InheritanceStep1() {
  const router = useRouter();
  const { totalEstate, debts, funeralExpenses, wasiyyah, setEstateField, currency } = useInheritance();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!totalEstate || parseFloat(totalEstate) <= 0) {
      setError('Please enter a valid total estate value');
      return;
    }

    const t = parseFloat(totalEstate) || 0;
    const d = parseFloat(debts) || 0;
    const f = parseFloat(funeralExpenses) || 0;
    const w = parseFloat(wasiyyah) || 0;

    const remainingAfterDebts = t - d - f;

    if (remainingAfterDebts < 0) {
      setError('Debts and funeral expenses cannot exceed total estate');
      return;
    }

    const maxWasiyyah = remainingAfterDebts / 3;
    if (w > maxWasiyyah) {
      setError(`Wasiyyah cannot exceed 1/3 of remaining estate (${maxWasiyyah.toFixed(2)})`);
      return;
    }

    setError(null);
    router.push('/inheritance/heirs');
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Inheritance (Mirath)" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.stepTitle}>Step 1 of 4</Text>
          <StepIndicator
            currentStep={1}
            totalSteps={4}
            labels={['Estate', 'Heirs', 'Summary', 'Results']}
          />

          <CalculationProfileBanner moduleName="MIRATH" />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estate Details</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <EstateField
              label="Total Estate Value"
              value={totalEstate}
              onChangeText={(val) => setEstateField('totalEstate', val)}
              currencySymbol={currencySymbol}
            />

            <EstateField
              label="Debts (Duyun)"
              value={debts}
              onChangeText={(val) => setEstateField('debts', val)}
              currencySymbol={currencySymbol}
              description="Any outstanding loans, mortgages, or unpaid zakat."
            />

            <EstateField
              label="Funeral Expenses (Tajhiz)"
              value={funeralExpenses}
              onChangeText={(val) => setEstateField('funeralExpenses', val)}
              currencySymbol={currencySymbol}
              description="Reasonable costs for washing, shrouding, and burial."
            />

            <EstateField
              label="Will (Wasiyyah) - Optional"
              value={wasiyyah}
              onChangeText={(val) => setEstateField('wasiyyah', val)}
              currencySymbol={currencySymbol}
              description="Bequests to non-heirs or charity. Max 1/3 of remaining estate."
            />

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Note: The Wasiyyah (Will) is restricted to a maximum of 1/3 of the estate after debts and funeral expenses are deducted.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Next: Add Heirs" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl + 20,
  },
  stepTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 18,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.error,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  noteBox: {
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
  },
  noteText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.secondaryLight,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
