/**
 * Exchange Rate Disclosure Component
 * Phase 12 — MIZAN Mobile Integration
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExchangeRateDisclosureProps {
  sourceCurrencyCode: string;
  targetCurrencyCode: string;
  rateValue: string;
  rateDate: string;
  providerName?: string;
  isEstimated?: boolean;
}

export const ExchangeRateDisclosure: React.FC<ExchangeRateDisclosureProps> = ({
  sourceCurrencyCode,
  targetCurrencyCode,
  rateValue,
  rateDate,
  providerName = 'Official Central Bank Source',
  isEstimated = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Exchange Rate Disclosure</Text>
        {isEstimated && <Text style={styles.badge}>ESTIMATED</Text>}
      </View>
      <Text style={styles.rateText}>
        1 {sourceCurrencyCode} = {rateValue} {targetCurrencyCode}
      </Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Valuation Date:</Text>
        <Text style={styles.detailValue}>{rateDate}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Source Authority:</Text>
        <Text style={styles.detailValue}>{providerName}</Text>
      </View>
      <Text style={styles.disclaimer}>
        Currency conversion applies to monetary presentation only. Sharia fractions and obligations remain invariant.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#F59E0B',
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rateText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  detailValue: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  disclaimer: {
    color: '#64748B',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
});
