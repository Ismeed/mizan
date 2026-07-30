import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  withGoldBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
  withGoldBorder = false,
}) => {
  return (
    <View style={[
      styles.card,
      elevated && styles.elevated,
      withGoldBorder && styles.goldBorder,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  goldBorder: {
    borderColor: colors.secondary,
    borderWidth: 1,
  },
});
