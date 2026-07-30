import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { Card } from '../ui/Card';

interface ZakatResultCardProps {
  isDue: boolean;
  totalWealth: string;
  debts: string;
  exempt: string;
  netWealth: string;
  nisab: string;
  zakatDue: string;
}

export const ZakatResultCard: React.FC<ZakatResultCardProps> = ({
  isDue,
  totalWealth,
  debts,
  exempt,
  netWealth,
  nisab,
  zakatDue,
}) => {
  return (
    <Card style={styles.container} withGoldBorder={isDue}>
      <View style={styles.header}>
        <Ionicons
          name={isDue ? 'checkmark-circle' : 'close-circle'}
          size={32}
          color={isDue ? colors.success : colors.textMuted}
        />
        <Text style={[styles.statusTitle, { color: isDue ? colors.success : colors.white }]}>
          {isDue ? 'Zakat is Due' : 'Zakat Not Due'}
        </Text>
      </View>
      
      {!isDue && (
        <Text style={styles.infoText}>
          Your net wealth is below the current Nisab threshold ({nisab}).
        </Text>
      )}

      <View style={styles.breakdown}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Wealth</Text>
          <Text style={styles.value}>{totalWealth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>(-) Debts</Text>
          <Text style={styles.value}>{debts}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>(-) Exempt Amount</Text>
          <Text style={styles.value}>{exempt}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.labelTotal}>Net Wealth</Text>
          <Text style={styles.valueTotal}>{netWealth}</Text>
        </View>
      </View>

      {isDue && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Zakat Due (2.5%)</Text>
          <Text style={styles.resultAmount}>{zakatDue}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 20,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  breakdown: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: typography.mono,
    fontSize: 14,
    color: colors.white,
  },
  labelTotal: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
  },
  valueTotal: {
    fontFamily: typography.mono,
    fontSize: 14,
    color: colors.secondary,
  },
  resultBox: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  resultLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.secondaryLight,
    marginBottom: spacing.xs,
  },
  resultAmount: {
    fontFamily: typography.heading,
    fontSize: 28,
    color: colors.secondary,
  },
});
