import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface ShareRowProps {
  heir: string;
  fraction: string;
  amount: string;
  isTotal?: boolean;
}

export const ShareRow: React.FC<ShareRowProps> = ({
  heir,
  fraction,
  amount,
  isTotal = false,
}) => {
  return (
    <View style={[styles.container, isTotal && styles.totalContainer]}>
      <Text style={[styles.heir, isTotal && styles.totalText]}>{heir}</Text>
      <Text style={[styles.fraction, isTotal && styles.totalText]}>{fraction}</Text>
      <Text style={[styles.amount, isTotal && styles.totalAmount]}>{amount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  totalContainer: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.md,
  },
  heir: {
    flex: 2,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.white,
  },
  fraction: {
    flex: 1,
    fontFamily: typography.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  amount: {
    flex: 2,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'right',
  },
  totalText: {
    fontFamily: typography.bodyBold,
    color: colors.white,
  },
  totalAmount: {
    fontFamily: typography.bodyBold,
    color: colors.secondary,
  },
});
