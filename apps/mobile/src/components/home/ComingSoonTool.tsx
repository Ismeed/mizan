import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface ComingSoonToolProps {
  title: string;
}

export const ComingSoonTool: React.FC<ComingSoonToolProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
