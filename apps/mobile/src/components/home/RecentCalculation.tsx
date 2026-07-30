import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface RecentCalculationProps {
  type: 'inheritance' | 'zakat';
  title: string;
  date: string;
  amount: string;
  onPress: () => void;
}

export const RecentCalculation: React.FC<RecentCalculationProps> = ({
  type,
  title,
  date,
  amount,
  onPress,
}) => {
  const icon = type === 'inheritance' ? 'people' : 'cash';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={colors.secondary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.amount}>{amount}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 2,
  },
  date: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: colors.secondary,
    marginRight: spacing.sm,
  },
});
