import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../ui/Input';
import { Text } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface EstateFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  currencySymbol?: string;
  description?: string;
  error?: string;
}

export const EstateField: React.FC<EstateFieldProps> = ({
  label,
  value,
  onChangeText,
  currencySymbol = '₦',
  description,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="0.00"
        leftIcon={<Text style={styles.currency}>{currencySymbol}</Text>}
        error={error}
      />
      {description && !error && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  currency: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.secondary,
  },
  description: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
});
