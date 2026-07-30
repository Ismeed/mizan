import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = forwardRef<any, ButtonProps>(({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}, ref) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: colors.primaryDark },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
          text: { color: colors.secondary },
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.error },
          text: { color: colors.white },
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: colors.primaryLight },
          text: { color: colors.white },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.container,
        variantStyles.container,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <Text style={[styles.text, variantStyles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontFamily: typography.bodySemiBold,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
