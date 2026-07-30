import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

export type BadgeVariant = 'premium' | 'success' | 'warning' | 'error' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style, textStyle }) => {
  const getStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: colors.primaryDark },
        };
      case 'success':
        return {
          container: { backgroundColor: colors.success },
          text: { color: colors.white },
        };
      case 'warning':
        return {
          container: { backgroundColor: colors.warning },
          text: { color: colors.primaryDark },
        };
      case 'error':
        return {
          container: { backgroundColor: colors.error },
          text: { color: colors.white },
        };
      case 'default':
      default:
        return {
          container: { backgroundColor: colors.border },
          text: { color: colors.white },
        };
    }
  };

  const variantStyles = getStyles();

  return (
    <View style={[styles.container, variantStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
  },
});
