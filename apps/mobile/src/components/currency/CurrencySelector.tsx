/**
 * Currency Selector Component
 * Phase 12 — MIZAN Mobile Integration
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { BASELINE_CURRENCY_REGISTRY, CurrencyDefinition } from '@mizan/shared';

interface CurrencySelectorProps {
  selectedCurrencyCode: string;
  onSelectCurrency: (currencyCode: string) => void;
  currencies?: CurrencyDefinition[];
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrencyCode,
  onSelectCurrency,
  currencies = BASELINE_CURRENCY_REGISTRY,
}) => {
  const renderItem = ({ item }: { item: CurrencyDefinition }) => {
    const isSelected = item.currencyCode === selectedCurrencyCode.toUpperCase();

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.itemSelected]}
        onPress={() => onSelectCurrency(item.currencyCode)}
        activeOpacity={0.7}
      >
        <View style={styles.symbolBadge}>
          <Text style={styles.symbolText}>{item.symbolMetadata.defaultSymbol}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.codeText}>{item.currencyCode}</Text>
          <Text style={styles.nameText}>{item.names['en']?.singular || item.currencyCode}</Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.currencyCode}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 8,
  },
  itemSelected: {
    borderColor: '#D4AF37', // MIZAN Gold accent
    backgroundColor: '#1F2937',
  },
  symbolBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symbolText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  nameText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  checkmark: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
