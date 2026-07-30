import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen }    from '../../src/components/layout/SafeScreen';
import { Header }        from '../../src/components/layout/Header';
import { colors }        from '../../src/constants/colors';
import { useZakat }      from '../../src/hooks/useZakat';
import { getCurrencySymbol } from '../../src/utils/currency.utils';
import type { IrrigationMethod, LivestockType } from '../../src/engine/zakat/types';

// ─── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ icon, color, title }: { icon: string; color: string; title: string }) {
  return (
    <View style={sectionStyles.row}>
      <View style={[sectionStyles.iconBg, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={sectionStyles.title}>{title}</Text>
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title:  { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
});

// ─── Currency input ───────────────────────────────────────────────────────────
function CurrencyInput({
  label, value, onChangeText, placeholder = '0', currencySymbol,
}: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string; currencySymbol?: string }) {
  const symbol = currencySymbol || getCurrencySymbol();
  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={inputStyles.row}>
        <View style={inputStyles.prefix}><Text style={inputStyles.prefixText}>{symbol}</Text></View>
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
        />
      </View>
    </View>
  );
}
const inputStyles = StyleSheet.create({
  container: { marginBottom: 20 },
  label:     { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.3 },
  row:       { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  prefix:    { backgroundColor: colors.surfaceElevated, paddingHorizontal: 14, justifyContent: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  prefixText:{ color: colors.secondary, fontSize: 18, fontWeight: '700' },
  input:     { flex: 1, backgroundColor: colors.surface, padding: 14, color: colors.textPrimary, fontSize: 16 },
});

// ─── Radio group (for irrigation) ────────────────────────────────────────────
function RadioGroup<T extends string>({
  label, options, selected, onSelect,
}: { label: string; options: Array<{ value: T; label: string }>; selected: T; onSelect: (v: T) => void }) {
  return (
    <View style={radioStyles.container}>
      <Text style={radioStyles.label}>{label}</Text>
      {options.map(opt => (
        <TouchableOpacity key={opt.value} style={radioStyles.option} onPress={() => onSelect(opt.value)} activeOpacity={0.7}>
          <View style={[radioStyles.circle, selected === opt.value && radioStyles.circleSelected]}>
            {selected === opt.value && <View style={radioStyles.dot} />}
          </View>
          <Text style={[radioStyles.optionLabel, selected === opt.value && radioStyles.optionLabelSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const radioStyles = StyleSheet.create({
  container:           { marginBottom: 20 },
  label:               { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 12, letterSpacing: 0.3 },
  option:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  circle:              { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  circleSelected:      { borderColor: colors.secondary },
  dot:                 { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.secondary },
  optionLabel:         { color: colors.textSecondary, fontSize: 15 },
  optionLabelSelected: { color: colors.textPrimary, fontWeight: '600' },
});

// ─── Livestock multi-select row ───────────────────────────────────────────────
interface LivestockRowProps {
  animalKey:   LivestockType;
  label:       string;
  nisab:       number;
  isChecked:   boolean;
  count:       number;
  onToggle:    () => void;
  onCountChange: (n: number) => void;
}
function LivestockRow({ animalKey, label, nisab, isChecked, count, onToggle, onCountChange }: LivestockRowProps) {
  const decrement = () => onCountChange(Math.max(0, count - 1));
  const increment = () => onCountChange(count + 1);

  return (
    <View style={lsStyles.container}>
      {/* Checkbox row */}
      <TouchableOpacity style={lsStyles.checkRow} onPress={onToggle} activeOpacity={0.8}>
        <View style={[lsStyles.checkbox, isChecked && lsStyles.checkboxChecked]}>
          {isChecked && <Ionicons name="checkmark" size={14} color={colors.primaryDark} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[lsStyles.checkLabel, isChecked && lsStyles.checkLabelActive]}>{label}</Text>
          <Text style={lsStyles.nisabHint}>Nisab: {nisab} {label.toLowerCase()}</Text>
        </View>
        {isChecked && count >= nisab && (
          <View style={lsStyles.duePill}>
            <Text style={lsStyles.duePillText}>DUE</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Stepper — shown only when checked */}
      {isChecked && (
        <View style={lsStyles.stepperRow}>
          <Text style={lsStyles.stepperLabel}>Number of {label}</Text>
          <View style={lsStyles.stepper}>
            <TouchableOpacity style={lsStyles.stepBtn} onPress={decrement} activeOpacity={0.7}>
              <Ionicons name="remove" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={lsStyles.stepCount}>{count}</Text>
            <TouchableOpacity style={lsStyles.stepBtn} onPress={increment} activeOpacity={0.7}>
              <Ionicons name="add" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const lsStyles = StyleSheet.create({
  container:         { marginBottom: 8 },
  checkRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  checkbox:          { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked:   { backgroundColor: colors.secondary, borderColor: colors.secondary },
  checkLabel:        { color: colors.textSecondary, fontSize: 15, fontWeight: '500' },
  checkLabelActive:  { color: colors.textPrimary, fontWeight: '700' },
  nisabHint:         { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  duePill:           { backgroundColor: colors.success + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  duePillText:       { color: colors.success, fontSize: 10, fontWeight: '800' },
  stepperRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 34, paddingBottom: 8 },
  stepperLabel:      { color: colors.textSecondary, fontSize: 13 },
  stepper:           { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn:           { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepCount:         { width: 48, textAlign: 'center', color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
});

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function CategoryCard({ children }: { children: React.ReactNode }) {
  return <View style={cardStyle.card}>{children}</View>;
}
const cardStyle = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ZakatDetailsScreen() {
  const { selectedTypes: param } = useLocalSearchParams<{ selectedTypes: string }>();
  const router = useRouter();
  const selectedTypes = param ? param.split(',') : [];

  const {
    cash, gold, silver, business, investments, agriculture, other,
    irrigation, livestockCounts, debts,
    setField, setIrrigation, setLivestockCount, setSelectedTypes,
    calculate, isCalculating,
  } = useZakat();

  const has = useCallback((id: string) => selectedTypes.includes(id), [selectedTypes]);

  const handleCalculate = async () => {
    setSelectedTypes(selectedTypes);
    const result = await calculate();
    if (result) router.push('/zakat/results');
  };

  const irrigationOptions: Array<{ value: IrrigationMethod; label: string }> = [
    { value: 'rain',       label: 'Rain-fed / Natural Rainfall' },
    { value: 'artificial', label: 'Artificial Irrigation' },
    { value: 'mixed',      label: 'Mixed Irrigation' },
  ];

  // Livestock toggle — checks/unchecks the type (doesn't reset count)
  const hasLivestockType = (type: LivestockType) => (livestockCounts[type] ?? 0) > 0;
  const toggleLivestock  = (type: LivestockType) => {
    if (hasLivestockType(type)) {
      setLivestockCount(type, 0);
    } else {
      // Default to 1 when enabling so the stepper is immediately useful
      setLivestockCount(type, 1);
    }
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Enter Wealth Details" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Step indicator */}
          <View style={styles.stepHeader}>
            <Text style={styles.stepText}>Step 2 of 3</Text>
            <Text style={styles.title}>Asset Values</Text>
            <Text style={styles.subtitle}>
              Enter the current market value of each selected asset in Naira (₦).
            </Text>
          </View>

          {/* Nisab info chip */}
          <View style={styles.nisabChip}>
            <Ionicons name="information-circle-outline" size={16} color={colors.secondary} />
            <Text style={styles.nisabText}>  Nisab is automatically fetched and applied by the Rule Engine.</Text>
          </View>

          {/* ── Cash & Savings ── */}
          {has('cash') && (
            <CategoryCard>
              <SectionHeader icon="wallet-outline" color="#48BB78" title="Cash & Savings" />
              <CurrencyInput
                label="Total Cash & Savings Value"
                value={cash}
                onChangeText={v => setField('cash', v)}
              />
            </CategoryCard>
          )}

          {/* ── Gold & Silver ── */}
          {has('gold') && (
            <CategoryCard>
              <SectionHeader icon="diamond-outline" color="#C9A84C" title="Gold & Silver" />
              <CurrencyInput
                label="Total Gold Value"
                value={gold}
                onChangeText={v => setField('gold', v)}
              />
              <CurrencyInput
                label="Total Silver Value"
                value={silver}
                onChangeText={v => setField('silver', v)}
              />
            </CategoryCard>
          )}

          {/* ── Business ── */}
          {has('business') && (
            <CategoryCard>
              <SectionHeader icon="briefcase-outline" color="#6366F1" title="Business Assets & Inventory" />
              <CurrencyInput
                label="Total Business Assets & Inventory Value"
                value={business}
                onChangeText={v => setField('business', v)}
              />
            </CategoryCard>
          )}

          {/* ── Investments ── */}
          {has('investments') && (
            <CategoryCard>
              <SectionHeader icon="trending-up-outline" color="#3B82F6" title="Investments & Stocks" />
              <CurrencyInput
                label="Total Investment Value"
                value={investments}
                onChangeText={v => setField('investments', v)}
              />
            </CategoryCard>
          )}

          {/* ── Agriculture ── */}
          {has('agriculture') && (
            <CategoryCard>
              <SectionHeader icon="leaf-outline" color="#84CC16" title="Agriculture" />
              <CurrencyInput
                label="Crop Market Value"
                value={agriculture}
                onChangeText={v => setField('agriculture', v)}
              />
              <RadioGroup
                label="Irrigation Method"
                options={irrigationOptions}
                selected={irrigation}
                onSelect={setIrrigation}
              />
            </CategoryCard>
          )}

          {/* ── Livestock (Multi-Select) ── */}
          {has('livestock') && (
            <CategoryCard>
              <SectionHeader icon="paw-outline" color="#F43F5E" title="Livestock" />

              <Text style={styles.lsInstruction}>
                Select all livestock types you own. Enter the number of each animal. Zakat is assessed independently per type.
              </Text>

              <LivestockRow
                animalKey="camels"
                label="Camels"
                nisab={5}
                isChecked={hasLivestockType('camels')}
                count={livestockCounts.camels ?? 0}
                onToggle={() => toggleLivestock('camels')}
                onCountChange={n => setLivestockCount('camels', n)}
              />

              <View style={styles.lsDivider} />

              <LivestockRow
                animalKey="cattle"
                label="Cattle"
                nisab={30}
                isChecked={hasLivestockType('cattle')}
                count={livestockCounts.cattle ?? 0}
                onToggle={() => toggleLivestock('cattle')}
                onCountChange={n => setLivestockCount('cattle', n)}
              />

              <View style={styles.lsDivider} />

              <LivestockRow
                animalKey="sheep"
                label="Sheep / Goats"
                nisab={40}
                isChecked={hasLivestockType('sheep')}
                count={livestockCounts.sheep ?? 0}
                onToggle={() => toggleLivestock('sheep')}
                onCountChange={n => setLivestockCount('sheep', n)}
              />

              <View style={styles.lsNote}>
                <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
                <Text style={styles.lsNoteText}>
                  Livestock Zakat is paid in kind (animals), not monetarily. The Rule Engine will determine the prescribed amount based on authenticated Hadith (Sahih Bukhari 1450).
                </Text>
              </View>
            </CategoryCard>
          )}

          {/* ── Other Assets ── */}
          {has('others') && (
            <CategoryCard>
              <SectionHeader icon="grid-outline" color="#A855F7" title="Other Zakatable Assets" />
              <CurrencyInput
                label="Total Other Zakatable Assets"
                value={other}
                onChangeText={v => setField('other', v)}
              />
            </CategoryCard>
          )}

          {/* ── Crypto (disabled / coming soon) ── */}
          {has('crypto') && (
            <CategoryCard>
              <SectionHeader icon="logo-bitcoin" color="#F59E0B" title="Cryptocurrency" />
              <View style={styles.comingSoon}>
                <Ionicons name="time-outline" size={32} color={colors.textMuted} />
                <Text style={styles.comingSoonText}>Coming Soon</Text>
                <Text style={styles.comingSoonSub}>Cryptocurrency Zakat is currently under scholarly review.</Text>
              </View>
            </CategoryCard>
          )}

          {/* ── Deductions (optional) ── */}
          <View style={styles.deductionsSection}>
            <Text style={styles.deductionsTitle}>Deductions (Optional)</Text>
            <Text style={styles.deductionsSub}>Outstanding debts may be deducted from your zakatable wealth.</Text>
            <CurrencyInput
              label="Outstanding Debts"
              value={debts}
              onChangeText={v => setField('debts', v)}
              placeholder="0"
            />
          </View>

        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.calcButton, isCalculating && styles.calcButtonDisabled]}
            onPress={handleCalculate}
            disabled={isCalculating}
            activeOpacity={0.85}
          >
            {isCalculating ? (
              <ActivityIndicator color={colors.primaryDark} />
            ) : (
              <>
                <Text style={styles.calcButtonText}>Calculate Zakat</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.primaryDark} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container:          { padding: 20, paddingBottom: 40 },
  stepHeader:         { marginBottom: 16 },
  stepText:           { color: colors.secondary, fontSize: 13, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1.2 },
  title:              { color: colors.textPrimary, fontSize: 26, fontWeight: 'bold', marginBottom: 6 },
  subtitle:           { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  nisabChip:          { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceElevated, borderRadius: 24, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.secondary + '40' },
  nisabText:          { color: colors.secondary, fontSize: 12, fontWeight: '500' },
  lsInstruction:      { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 16 },
  lsDivider:          { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  lsNote:             { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 14, padding: 12, backgroundColor: colors.surfaceElevated, borderRadius: 10 },
  lsNoteText:         { flex: 1, color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  comingSoon:         { alignItems: 'center', paddingVertical: 24, gap: 8 },
  comingSoonText:     { color: colors.textMuted, fontSize: 18, fontWeight: '700' },
  comingSoonSub:      { color: colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  deductionsSection:  { marginTop: 8, padding: 20, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  deductionsTitle:    { color: colors.secondary, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  deductionsSub:      { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 16 },
  footer:             { paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surfaceElevated },
  calcButton:         { backgroundColor: colors.secondary, paddingVertical: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  calcButtonDisabled: { opacity: 0.6 },
  calcButtonText:     { color: colors.primaryDark, fontSize: 17, fontWeight: 'bold' },
});
