import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { Card } from '../ui/Card';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <Card style={styles.card} withGoldBorder>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={28} color={colors.secondary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.footer}>
          <Text style={styles.actionText}>Calculate</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.secondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  card: {
    padding: spacing.md,
    height: 180,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.headingMedium,
    fontSize: 16,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.secondary,
    marginRight: spacing.xs,
  },
});
