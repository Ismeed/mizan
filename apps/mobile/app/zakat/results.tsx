import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter }           from 'expo-router';
import { Ionicons }            from '@expo/vector-icons';
import { SafeScreen }          from '../../src/components/layout/SafeScreen';
import { Header }              from '../../src/components/layout/Header';
import { colors }              from '../../src/constants/colors';
import { useZakatStore }       from '../../src/stores/zakat.store';
import { pdfService }          from '../../src/services/pdf.service';
import type { CategoryResult } from '../../src/engine/zakat/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(amount: number, currency = 'NGN'): string {
  const sym: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
  const prefix = sym[currency] ?? currency + ' ';
  return `${prefix}${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Summary row ─────────────────────────────────────────────────────────────
function SummaryRow({
  label, value, highlight = false, muted = false, large = false,
}: { label: string; value: string; highlight?: boolean; muted?: boolean; large?: boolean }) {
  return (
    <View style={summaryStyles.row}>
      <Text style={[summaryStyles.label, muted && summaryStyles.muted]}>{label}</Text>
      <Text style={[
        summaryStyles.value,
        highlight  && summaryStyles.highlight,
        muted      && summaryStyles.muted,
        large      && summaryStyles.large,
      ]}>
        {value}
      </Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  label:     { color: colors.textSecondary, fontSize: 14, flex: 1, paddingRight: 8 },
  value:     { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  highlight: { color: colors.secondary },
  muted:     { color: colors.textMuted, fontSize: 13 },
  large:     { fontSize: 18, fontWeight: '800' },
});

// ─── Category card ────────────────────────────────────────────────────────────
function CategoryCard({ cat, currency }: { cat: CategoryResult; currency: string }) {
  const [expanded, setExpanded] = useState(false);

  const isLivestock = cat.id === 'livestock';
  const showAmount  = !isLivestock && cat.declared > 0;

  return (
    <View style={catStyles.card}>
      {/* Header row */}
      <View style={catStyles.headerRow}>
        <View style={catStyles.namePill}>
          <View style={[catStyles.dot, { backgroundColor: cat.isEligible ? colors.success : colors.textMuted }]} />
          <Text style={catStyles.name}>{cat.name}</Text>
        </View>
        {cat.isEligible && !isLivestock && (
          <Text style={catStyles.zakatBadge}>{fmt(cat.zakatDue, currency)}</Text>
        )}
        {isLivestock && cat.isEligible && (
          <Text style={catStyles.zakatBadge}>Due in Kind</Text>
        )}
        {!cat.isEligible && (
          <Text style={catStyles.notDueBadge}>Not Due</Text>
        )}
      </View>

      {/* Data rows */}
      <View style={catStyles.divider} />

      {showAmount && (
        <View style={catStyles.dataRow}>
          <Text style={catStyles.dataLabel}>Declared</Text>
          <Text style={catStyles.dataValue}>{fmt(cat.declared, currency)}</Text>
        </View>
      )}

      {cat.rateLabel !== 'Per Hadith Table' && (
        <View style={catStyles.dataRow}>
          <Text style={catStyles.dataLabel}>Applicable Rate</Text>
          <Text style={catStyles.dataValue}>{cat.rateLabel}</Text>
        </View>
      )}

      {cat.metadata && Object.entries(cat.metadata).map(([k, v]) => (
        <View style={catStyles.dataRow} key={k}>
          <Text style={catStyles.dataLabel}>{k}</Text>
          <Text style={catStyles.dataValue}>{v}</Text>
        </View>
      ))}

      {showAmount && cat.isEligible && (
        <View style={catStyles.dataRow}>
          <Text style={catStyles.dataLabel}>Zakat Due</Text>
          <Text style={[catStyles.dataValue, catStyles.gold]}>{fmt(cat.zakatDue, currency)}</Text>
        </View>
      )}

      {/* Explanation + references (expandable) */}
      <TouchableOpacity style={catStyles.expandBtn} onPress={() => setExpanded(e => !e)} activeOpacity={0.7}>
        <Text style={catStyles.expandLabel}>{expanded ? 'Hide explanation' : 'View explanation & references'}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.secondary} />
      </TouchableOpacity>

      {expanded && (
        <View style={catStyles.explanationBox}>
          <Text style={catStyles.explanationText}>{cat.explanation}</Text>
          {cat.references.length > 0 && (
            <View style={catStyles.refsContainer}>
              {cat.references.map((ref, i) => (
                <View key={i} style={catStyles.refRow}>
                  <View style={[catStyles.refBadge, ref.type === 'quran' ? catStyles.quranBadge : catStyles.hadithBadge]}>
                    <Text style={catStyles.refBadgeText}>{ref.type === 'quran' ? 'Qur\'ān' : 'Hadīth'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={catStyles.refText}>{ref.text}</Text>
                    <Text style={catStyles.refSource}>— {ref.source}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const catStyles = StyleSheet.create({
  card:          { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  namePill:      { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  dot:           { width: 8, height: 8, borderRadius: 4 },
  name:          { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  zakatBadge:    { backgroundColor: colors.success + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, color: colors.success, fontSize: 13, fontWeight: '700' },
  notDueBadge:   { backgroundColor: colors.textMuted + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, color: colors.textMuted, fontSize: 12 },
  divider:       { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  dataRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dataLabel:     { color: colors.textMuted, fontSize: 13 },
  dataValue:     { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  gold:          { color: colors.secondary },
  expandBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  expandLabel:   { color: colors.secondary, fontSize: 12, fontWeight: '600' },
  explanationBox:{ marginTop: 12, backgroundColor: colors.surfaceElevated, borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: colors.secondary },
  explanationText:{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  refsContainer: { gap: 10 },
  refRow:        { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  refBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  quranBadge:    { backgroundColor: '#C9A84C22' },
  hadithBadge:   { backgroundColor: '#48BB7822' },
  refBadgeText:  { fontSize: 10, fontWeight: '700', color: colors.secondary },
  refText:       { color: colors.textSecondary, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  refSource:     { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ZakatResultsScreen() {
  const router = useRouter();
  const { engineResult, debts, reset } = useZakatStore();
  const [isSaving, setIsSaving]         = useState(false);
  const [isPdf, setIsPdf]               = useState(false);

  if (!engineResult) {
    return (
      <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
        <Header title="Zakat Results" />
        <View style={styles.centered}>
          <Ionicons name="calculator-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No Result Found</Text>
          <Text style={styles.emptyText}>Please complete the wealth details to calculate Zakat.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Enter Details</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  const {
    isDue, totalDeclaredWealth, totalDebts, netZakatableWealth,
    nisabThreshold, totalZakatDue, categories, madhhab, currency, calculatedAt,
  } = engineResult;

  const dateStr = new Date(calculatedAt).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await pdfService.saveZakatEngineResult(engineResult);
      Alert.alert('Saved ✓', 'Your Zakat calculation has been saved to history.');
    } catch {
      Alert.alert('Notice', 'Could not save to history at this time.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePDF = async () => {
    setIsPdf(true);
    try {
      await pdfService.generateAndShareZakatEnginePDF(engineResult);
    } catch (err) {
      console.error('PDF error:', err);
      Alert.alert('PDF Error', 'Could not generate the report. Please try again.');
    } finally {
      setIsPdf(false);
    }
  };

  const handleHome = () => {
    reset();
    router.dismissAll();
    router.replace('/');
  };

  const meetsNisab = netZakatableWealth >= nisabThreshold;
  const liveCats   = categories.filter(c => c.id !== 'livestock');
  const livestock  = categories.find(c => c.id === 'livestock');

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Zakat Results" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Status banner ── */}
        <View style={[styles.statusBanner, isDue ? styles.bannerDue : styles.bannerNotDue]}>
          <Ionicons
            name={isDue ? 'checkmark-circle' : 'information-circle'}
            size={28}
            color={isDue ? colors.success : colors.textMuted}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.statusTitle, isDue ? { color: colors.success } : { color: colors.textMuted }]}>
              {isDue ? 'Zakat is Obligatory' : 'Zakat Not Obligatory'}
            </Text>
            <Text style={styles.statusSub}>
              {isDue
                ? `Total Zakat due this lunar year: ${fmt(totalZakatDue, currency)}`
                : 'Your declared wealth is below the Nisab threshold.'}
            </Text>
          </View>
        </View>

        {/* ── Calculation info ── */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {dateStr}</Text>
          <Text style={styles.metaText}>🕌 School: {madhhab}</Text>
        </View>

        {/* ── Overall summary card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall Summary</Text>
          <View style={styles.cardDivider} />
          <SummaryRow label="Total Declared Wealth"  value={fmt(totalDeclaredWealth, currency)} />
          {totalDebts > 0 && (
            <SummaryRow label="(-) Outstanding Debts" value={`−${fmt(totalDebts, currency)}`} muted />
          )}
          <SummaryRow label="Net Zakatable Wealth"   value={fmt(netZakatableWealth, currency)} highlight />
          <View style={styles.cardDivider} />
          <SummaryRow
            label="Nisab Threshold"
            value={fmt(nisabThreshold, currency)}
          />
          <View style={styles.nisabStatus}>
            <Text style={styles.nisabLabel}>Nisab Status</Text>
            <View style={[styles.nisabBadge, meetsNisab ? styles.nisabMet : styles.nisabNotMet]}>
              <Ionicons
                name={meetsNisab ? 'checkmark' : 'close'}
                size={12}
                color={meetsNisab ? colors.success : colors.error}
              />
              <Text style={[styles.nisabBadgeText, { color: meetsNisab ? colors.success : colors.error }]}>
                {meetsNisab ? 'Meets Nisab' : 'Below Nisab'}
              </Text>
            </View>
          </View>
          <View style={styles.totalZakatBox}>
            <Text style={styles.totalZakatLabel}>TOTAL ZAKAT DUE</Text>
            <Text style={styles.totalZakatValue}>{fmt(totalZakatDue, currency)}</Text>
          </View>
        </View>

        {/* ── Category breakdown ── */}
        {categories.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Breakdown by Wealth Category</Text>
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} currency={currency} />
            ))}
          </>
        )}

        {/* ── Livestock notice ── */}
        {livestock && livestock.isEligible && (
          <View style={styles.livestockNote}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
            <Text style={styles.livestockNoteText}>
              Livestock Zakat is paid in kind (animals), not as a monetary sum. Please consult a qualified scholar for the applicable equivalent.
            </Text>
          </View>
        )}

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSave} disabled={isSaving}>
            {isSaving
              ? <ActivityIndicator color={colors.primaryDark} />
              : <Text style={styles.primaryBtnText}>Save to History</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn} onPress={handlePDF} disabled={isPdf}>
            {isPdf
              ? <ActivityIndicator color={colors.secondary} />
              : (
                <View style={styles.btnRow}>
                  <Ionicons name="document-text-outline" size={18} color={colors.secondary} />
                  <Text style={styles.outlineBtnText}>Download PDF Report</Text>
                </View>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} onPress={handleHome}>
            <Text style={styles.linkBtnText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emptyTitle:{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  emptyText: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 21 },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1,
  },
  bannerDue:    { backgroundColor: colors.success + '12', borderColor: colors.success + '40' },
  bannerNotDue: { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
  statusTitle:  { fontSize: 16, fontWeight: '800' },
  statusSub:    { color: colors.textSecondary, fontSize: 13, marginTop: 2, lineHeight: 18 },

  metaRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metaText: { color: colors.textMuted, fontSize: 12 },

  card:        { backgroundColor: colors.surface, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  cardTitle:   { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },

  nisabStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  nisabLabel:  { color: colors.textSecondary, fontSize: 14 },
  nisabBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  nisabMet:    { backgroundColor: colors.success + '20' },
  nisabNotMet: { backgroundColor: colors.error + '20' },
  nisabBadgeText: { fontSize: 13, fontWeight: '700' },

  totalZakatBox: {
    marginTop: 16, paddingTop: 16, borderTopWidth: 1,
    borderTopColor: colors.secondary + '40',
    alignItems: 'center', backgroundColor: colors.secondary + '10',
    borderRadius: 12, padding: 16,
  },
  totalZakatLabel: { color: colors.secondary, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  totalZakatValue: { color: colors.secondary, fontSize: 34, fontWeight: '900' },

  sectionHeading: { color: colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 12 },

  livestockNote: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: colors.warning + '15', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.warning + '40', marginBottom: 16,
  },
  livestockNoteText: { flex: 1, color: colors.warning, fontSize: 13, lineHeight: 19 },

  actions:       { gap: 12, marginTop: 8 },
  primaryBtn:    { backgroundColor: colors.secondary, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  primaryBtnText:{ color: colors.primaryDark, fontSize: 16, fontWeight: '800' },
  outlineBtn:    { borderWidth: 1.5, borderColor: colors.secondary, paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  outlineBtnText:{ color: colors.secondary, fontSize: 15, fontWeight: '700' },
  btnRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkBtn:       { alignItems: 'center', paddingVertical: 12 },
  linkBtnText:   { color: colors.textMuted, fontSize: 14 },
});
