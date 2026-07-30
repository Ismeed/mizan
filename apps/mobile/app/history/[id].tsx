import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { useHistoryStore, HistoryEntry } from '../../src/stores/history.store';
import { pdfService } from '../../src/services/pdf.service';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing } from '../../src/constants/spacing';
import type { ZakatEngineResult } from '../../src/engine/zakat/types';
import type { InheritanceResult } from '../../src/types/inheritance.types';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, remove } = useHistoryStore();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    if (id) {
      const found = entries.find(e => e.id === id);
      if (found) {
        setEntry(found);
      } else {
        router.back();
      }
    }
  }, [id, entries, router]);

  if (!entry) return null;

  const isZakat = entry.type === 'zakat';
  const engineResult = entry.engineResult;
  const dateStr = new Date(entry.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this calculation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            remove(entry.id);
            router.back();
          } 
        }
      ]
    );
  };

  const handleExportPDF = async () => {
    try {
      if (isZakat) {
        await pdfService.generateAndShareZakatEnginePDF(engineResult as ZakatEngineResult);
      } else {
        await pdfService.generateAndShareInheritancePDF(engineResult as InheritanceResult);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const renderZakatDetails = () => {
    const res = engineResult as ZakatEngineResult;
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Nisab Status</Text>
          <Text style={[styles.value, { color: res.isDue ? colors.success : colors.error }]}>
            {res.isDue ? '✓ Met' : '✗ Not Met'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nisab Threshold</Text>
          <Text style={styles.value}>{res.currency} {res.nisabThreshold.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Declared Wealth</Text>
          <Text style={styles.value}>{res.currency} {res.totalDeclaredWealth.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Debts</Text>
          <Text style={styles.value}>{res.currency} {res.totalDebts.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Net Zakatable Wealth</Text>
          <Text style={styles.value}>{res.currency} {res.netZakatableWealth.toLocaleString()}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Zakat Due</Text>
          <Text style={styles.totalValue}>{res.currency} {res.totalZakatDue.toLocaleString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        {res.categories.map((cat, idx) => (
          <View key={idx} style={styles.categoryCard}>
            <Text style={styles.categoryName}>{cat.name}</Text>
            {cat.declared > 0 && (
              <Text style={styles.categoryText}>Declared: {res.currency} {cat.declared.toLocaleString()}</Text>
            )}
            <Text style={styles.categoryText}>Rate: {cat.rateLabel}</Text>
            <Text style={styles.categoryTextBold}>Zakat Due: {res.currency} {cat.zakatDue.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInheritanceDetails = () => {
    const res = engineResult as InheritanceResult;
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Net Estate</Text>
          <Text style={styles.value}>{res.netEstate.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Heirs</Text>
          <Text style={styles.value}>{entry.heirCount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Calculation Method</Text>
          <Text style={styles.value}>{res.calculationMethod}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Shares</Text>
        {res.shares.map((share, idx) => (
          <View key={idx} style={styles.categoryCard}>
            <Text style={styles.categoryName}>{share.label} (x{share.count})</Text>
            <Text style={styles.categoryText}>Type: {share.shareType}</Text>
            {!share.isBlocked && share.shareType !== 'BLOCKED' && share.shareType !== 'NONE' && (
              <>
                <Text style={styles.categoryText}>Fraction: {share.fractionLabel} ({(share.shareOfEstate * 100).toFixed(2)}%)</Text>
                <Text style={styles.categoryTextBold}>Total Amount: {share.totalAmount.toLocaleString()}</Text>
              </>
            )}
            {share.isBlocked && (
              <Text style={[styles.categoryText, { color: colors.error }]}>Blocked: {share.blockingReason}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Calculation Details" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <View style={[styles.typeBadge, { backgroundColor: isZakat ? colors.secondary : colors.success }]}>
            <Text style={styles.typeBadgeText}>{entry.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.madhhabText}>{entry.madhhab} School</Text>
        </View>

        {isZakat ? renderZakatDetails() : renderInheritanceDetails()}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportPDF}>
            <Ionicons name="document-text-outline" size={20} color={colors.white} style={styles.actionIcon} />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.error} style={styles.actionIcon} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  typeBadgeText: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 12,
    color: colors.white,
  },
  dateText: {
    fontFamily: (typography as any).headingMedium || 'System',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  madhhabText: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalRow: {
    marginTop: spacing.sm,
    borderBottomWidth: 0,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 8,
  },
  label: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: (typography as any).bodyMedium || 'System',
    fontSize: 14,
    color: colors.textPrimary,
  },
  totalLabel: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 16,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 16,
    color: colors.secondary,
  },
  sectionTitle: {
    fontFamily: (typography as any).headingMedium || 'System',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  categoryName: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  categoryTextBold: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  exportButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  exportButtonText: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 16,
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontFamily: (typography as any).bodyMedium || 'System',
    fontSize: 16,
    color: colors.error,
  },
  actionIcon: {
    marginRight: spacing.sm,
  },
});
