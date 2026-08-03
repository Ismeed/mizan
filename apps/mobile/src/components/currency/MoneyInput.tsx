/**
 * Money Input Component
 * Phase 12 — MIZAN Mobile Integration
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface MoneyInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  currencyCode: string;
  symbol?: string;
  error?: string;
  placeholder?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  value,
  onChangeText,
  currencyCode,
  symbol = '₦',
  error,
  placeholder = '0.00',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !!error && styles.inputWrapperError]}>
        <View style={styles.currencyBadge}>
          <Text style={styles.currencyBadgeText}>{symbol}</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
        />
        <Text style={styles.currencyCodeText}>{currencyCode}</Text>
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
  },
  currencyBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyBadgeText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currencyCodeText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    paddingRight: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
