import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { colors } from '../../src/constants/colors';

const WEALTH_TYPES = [
  { id: 'cash', label: 'Cash & Savings', icon: 'wallet-outline', iconColor: '#48BB78' },
  { id: 'gold', label: 'Gold & Silver', icon: 'diamond-outline', iconColor: '#C9A84C' },
  { id: 'business', label: 'Business & Inventory', icon: 'briefcase-outline', iconColor: '#6366F1' },
  { id: 'investments', label: 'Investments & Stocks', icon: 'trending-up-outline', iconColor: '#3B82F6' },
  { id: 'agriculture', label: 'Agriculture', icon: 'leaf-outline', iconColor: '#84CC16' },
  { id: 'livestock', label: 'Livestock', icon: 'paw-outline', iconColor: '#F43F5E' },
  { id: 'others', label: 'Others', icon: 'grid-outline', iconColor: '#A855F7' },
  { id: 'crypto', label: 'Crypto', icon: 'logo-bitcoin', iconColor: '#F59E0B', disabled: true, subtitle: 'Coming Soon' },
];

import { CalculationProfileBanner } from '../../src/components/profile/CalculationProfileBanner';

export default function ZakatIndexScreen() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedTypes.length > 0) {
      router.push({
        pathname: '/zakat/details',
        params: { selectedTypes: selectedTypes.join(',') }
      });
    }
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Zakat Calculator" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CalculationProfileBanner moduleName="ZAKAT" />
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
          <Text style={styles.title}>Select Wealth Types</Text>
          <Text style={styles.subtitle}>Select the types of wealth you own to begin calculating your Zakat.</Text>
        </View>

        <View style={styles.grid}>
          {WEALTH_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type.id);
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  type.disabled && styles.cardDisabled
                ]}
                onPress={() => !type.disabled && toggleType(type.id)}
                activeOpacity={type.disabled ? 1 : 0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: type.iconColor + '20' }]}>
                    <Ionicons name={type.icon as any} size={24} color={type.iconColor} />
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.secondary} />
                  )}
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardLabel, type.disabled && styles.textDisabled]}>
                    {type.label}
                  </Text>
                  {type.subtitle && (
                    <Text style={styles.cardSubtitle}>{type.subtitle}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedTypes.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedTypes.length === 0}
        >
          <Text style={styles.nextButtonText}>Next: Enter Details</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  stepText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.surfaceElevated,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    marginTop: 12,
  },
  cardLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  nextButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
