import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { StepIndicator } from '../../src/components/ui/StepIndicator';
import { Button } from '../../src/components/ui/Button';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useInheritance } from '../../src/hooks/useInheritance';

/** Format a number as a locale currency string */
function formatCurrency(amount: number, currency: string): string {
  const sym: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€', SAR: 'ر.س', AED: 'د.إ', MYR: 'RM' };
  const prefix = sym[currency] ?? currency + ' ';
  return prefix + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InheritanceSummaryScreen() {
  const router = useRouter();
  const { totalEstate, debts, funeralExpenses, wasiyyah, heirs, currency, isCalculating, calculate } = useInheritance();

  const netEstate = Math.max(
    0,
    (parseFloat(totalEstate) || 0) -
    (parseFloat(debts) || 0) -
    (parseFloat(funeralExpenses) || 0) -
    (parseFloat(wasiyyah) || 0),
  );

  // Build a summary list of heirs who have count > 0
  const heirSummaryItems = Object.entries(heirs)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      key,
      label: heirKeyToLabel(key),
      count: count as number,
    }));

  const handleCalculate = async () => {
    if (heirSummaryItems.length === 0) {
      Alert.alert(
        'No Heirs Added',
        'Please go back and add at least one heir before calculating.',
        [{ text: 'Go Back', onPress: () => router.back() }],
      );
      return;
    }

    const result = await calculate();
    if (result) {
      router.push('/inheritance/results');
    } else {
      Alert.alert('Error', 'An error occurred during calculation. Please try again.');
    }
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Review & Calculate" />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Step 3 of 4</Text>
          <StepIndicator
            currentStep={3}
            totalSteps={4}
            labels={['Estate', 'Heirs', 'Summary', 'Results']}
          />

          {/* Estate Summary Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estate Summary</Text>

            <SummaryRow label="Total Estate" value={formatCurrency(parseFloat(totalEstate) || 0, currency)} />
            {parseFloat(debts) > 0 && (
              <SummaryRow label="Debts (Duyun)" value={`− ${formatCurrency(parseFloat(debts), currency)}`} isDeduction />
            )}
            {parseFloat(funeralExpenses) > 0 && (
              <SummaryRow label="Funeral Expenses" value={`− ${formatCurrency(parseFloat(funeralExpenses), currency)}`} isDeduction />
            )}
            {parseFloat(wasiyyah) > 0 && (
              <SummaryRow label="Wasiyyah (Will)" value={`− ${formatCurrency(parseFloat(wasiyyah), currency)}`} isDeduction />
            )}

            <View style={styles.divider} />
            <SummaryRow
              label="Net Distributable Estate"
              value={formatCurrency(netEstate, currency)}
              isTotal
            />
          </View>

          {/* Heirs Summary Card */}
          <View style={[styles.card, { marginTop: spacing.md }]}>
            <Text style={styles.cardTitle}>
              Heirs ({heirSummaryItems.reduce((s, h) => s + h.count, 0)} total)
            </Text>

            {heirSummaryItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={32} color={colors.textMuted} />
                <Text style={styles.emptyText}>No heirs added yet</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.backLink}>← Go back to add heirs</Text>
                </TouchableOpacity>
              </View>
            ) : (
              heirSummaryItems.map((item, index) => (
                <HeirRow key={`${item.key}-${index}`} label={item.label} count={item.count} />
              ))
            )}
          </View>

          {/* Info Banner */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color={colors.secondary} />
            <Text style={styles.infoText}>
              Shares are calculated according to the Hanafi school of Islamic law, based on Quran 4:11-12 and 4:176.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isCalculating ? 'Calculating…' : 'Calculate Shares'}
            onPress={handleCalculate}
            disabled={isCalculating || heirSummaryItems.length === 0}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────────

function SummaryRow({ label, value, isDeduction = false, isTotal = false }: {
  label: string; value: string; isDeduction?: boolean; isTotal?: boolean;
}) {
  return (
    <View style={summaryRowStyles.row}>
      <Text style={[summaryRowStyles.label, isTotal && summaryRowStyles.totalLabel]}>{label}</Text>
      <Text style={[
        summaryRowStyles.value,
        isDeduction && summaryRowStyles.deductionValue,
        isTotal && summaryRowStyles.totalValue,
      ]}>
        {value}
      </Text>
    </View>
  );
}

const summaryRowStyles = StyleSheet.create({
  row:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  label:          { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, flex: 1 },
  value:          { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.white },
  deductionValue: { color: colors.error },
  totalLabel:     { color: colors.white, fontFamily: 'Inter_600SemiBold' },
  totalValue:     { color: colors.secondary, fontSize: 16 },
});

function HeirRow({ label, count }: { label: string; count: number }) {
  return (
    <View style={heirRowStyles.row}>
      <View style={heirRowStyles.dot} />
      <Text style={heirRowStyles.label}>{label}</Text>
      <View style={heirRowStyles.badge}>
        <Text style={heirRowStyles.count}>{count}</Text>
      </View>
    </View>
  );
}

const heirRowStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  dot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary, marginRight: spacing.sm },
  label: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary },
  badge: { backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: 10, paddingVertical: 2 },
  count: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.secondary },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:    { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepTitle: {
    fontFamily: 'Inter_600SemiBold',
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
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.white,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  backLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.secondary,
    marginTop: spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    gap: spacing.sm,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.secondaryLight,
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

// ─── Key → Label mapping ──────────────────────────────────────────────────────

function heirKeyToLabel(key: string): string {
  const map: Record<string, string> = {
    husband: 'Husband', wives: 'Wife/Wives', sons: 'Son(s)',
    daughters: 'Daughter(s)', father: 'Father', mother: 'Mother',
    paternalGrandfathers: 'Paternal Grandfather', paternalGrandmothers: 'Paternal Grandmother',
    maternalGrandmothers: 'Maternal Grandmother', fullBrothers: 'Full Brother(s)',
    fullSisters: 'Full Sister(s)', paternalHalfBrothers: 'Paternal Half-Brother(s)',
    paternalHalfSisters: 'Paternal Half-Sister(s)', maternalHalfSiblings: 'Maternal Half-Sibling(s)',
    sonsOfFullBrothers: "Full Brother's Son(s)", sonsOfPatHalfBrothers: "Pat. Half-Brother's Son(s)",
    paternalUncles: 'Paternal Uncle(s)', sonsOfPatUncles: "Paternal Uncle's Son(s)",
  };
  return map[key] ?? key;
}
