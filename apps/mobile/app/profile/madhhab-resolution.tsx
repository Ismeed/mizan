import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react'
import { useRouter } from 'expo-router';

type MadhhabCode = 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI';
type BranchStrategy = 'SHARED_BASE' | 'PARTIAL_AGREEMENT' | 'NARROW_OVERRIDE' | 'FULL_BRANCH';

interface MadhhabBranchInfo {
  madhhab: MadhhabCode;
  strategy: BranchStrategy;
  description: string;
  keyCharacteristics: string[];
}

const MADHHAB_INFO: Record<MadhhabCode, MadhhabBranchInfo> = {
  HANAFI: {
    madhhab: 'HANAFI',
    strategy: 'SHARED_BASE',
    description: 'Imam Abu Hanifa school — uses shared base rules for core shares with Hanafi-specific Radd (spouse excluded) and grandfather/brother rules.',
    keyCharacteristics: [
      'Radd (Surplus) allowed; spouse excluded from Radd',
      'Grandfather with brothers: Akdariyya rule applies',
      'Mother gets 1/3 of remainder in Al-Umariyyatan',
      'Maternal grandfather blocks maternal grandmother',
    ],
  },
  MALIKI: {
    madhhab: 'MALIKI',
    strategy: 'NARROW_OVERRIDE',
    description: 'Imam Malik school — narrow override where spouse CAN receive Radd, and maternal grandfather does not block maternal grandmother.',
    keyCharacteristics: [
      'Radd allowed; spouse CAN receive Radd (narrow override)',
      'Maternal grandfather does NOT block maternal grandmother',
      'Grandfather with brothers: muqasama priority',
    ],
  },
  SHAFII: {
    madhhab: 'SHAFII',
    strategy: 'PARTIAL_AGREEMENT',
    description: 'Imam al-Shafi’i school — partial agreement with Sunni consensus; no Radd to anyone (surplus goes to Bayt al-Mal).',
    keyCharacteristics: [
      'NO Radd to anyone; surplus goes to public treasury',
      'Recognises Al-Umariyyatan (mother gets 1/3 of remainder)',
      'Grandfather with brothers follows Shafi’i table',
    ],
  },
  HANBALI: {
    madhhab: 'HANBALI',
    strategy: 'PARTIAL_AGREEMENT',
    description: 'Imam Ahmad ibn Hanbal school — partial agreement; grandfather blocks brothers completely (Ibn Qudama position).',
    keyCharacteristics: [
      'Grandfather blocks brothers completely',
      'Uterine siblings blocked by grandfather',
      'NO Radd to anyone (same as Shafi’i)',
    ],
  },
  JAFARI: {
    madhhab: 'JAFARI',
    strategy: 'FULL_BRANCH',
    description: 'Ja’fari (Shia Ithna Ashari) school — FULL BRANCH strategy. Uses 3-class priority order completely distinct from Sunni schools.',
    keyCharacteristics: [
      'Class 1, Class 2, Class 3 priority structure',
      'Spouse does NOT inherit land/real estate (value only)',
      'Siblings do NOT block grandparents',
      'Maternal relatives inherit before distant paternal relatives',
    ],
  },
};

export default function MadhhabResolutionScreen() {
  const router = useRouter();
  const [selectedMadhhab, setSelectedMadhhab] = useState<MadhhabCode>('HANAFI');

  const currentInfo = MADHHAB_INFO[selectedMadhhab];

  const getStrategyColor = (strategy: BranchStrategy) => {
    switch (strategy) {
      case 'SHARED_BASE': return '#2563EB';
      case 'PARTIAL_AGREEMENT': return '#059669';
      case 'NARROW_OVERRIDE': return '#D97706';
      case 'FULL_BRANCH': return '#7C3AED';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Madhhab Rule Resolution</Text>
        <Text style={styles.subtitle}>
          MIZAN Canonical Madhhab Resolution Engine — Phase 5
        </Text>
      </View>

      {/* Selector */}
      <View style={styles.selectorRow}>
        {(['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] as MadhhabCode[]).map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.chip, selectedMadhhab === m && styles.chipActive]}
            onPress={() => setSelectedMadhhab(m)}
          >
            <Text style={[styles.chipText, selectedMadhhab === m && styles.chipTextActive]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.madhhabTitle}>{currentInfo.madhhab} School</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStrategyColor(currentInfo.strategy) },
            ]}
          >
            <Text style={styles.badgeText}>{currentInfo.strategy.replace('_', ' ')}</Text>
          </View>
        </View>

        <Text style={styles.description}>{currentInfo.description}</Text>

        <Text style={styles.sectionHeading}>Key Jurisprudential Invariants</Text>
        {currentInfo.keyCharacteristics.map((item, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Architectural Guarantee */}
      <View style={styles.guaranteeBox}>
        <Text style={styles.guaranteeTitle}>Determinism & Auditability Guarantee</Text>
        <Text style={styles.guaranteeText}>
          Rule resolution is strictly locked to your frozen Calculation Profile. Every calculation
          writes a permanent, immutable MadhhabResolutionAudit trace verifying which branch rule was selected and why.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  madhhabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletPoint: {
    color: '#38BDF8',
    fontSize: 14,
    marginRight: 8,
  },
  bulletText: {
    color: '#E2E8F0',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  guaranteeBox: {
    backgroundColor: '#030712',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
});
