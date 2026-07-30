import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { StepIndicator } from '../../src/components/ui/StepIndicator';
import { Button } from '../../src/components/ui/Button';
import { HeirCounter } from '../../src/components/inheritance/HeirCounter';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useInheritanceStore } from '../../src/stores/inheritance.store';
import { useSettingsStore } from '../../src/stores/settings.store';
import { MadhhabProvider } from '../../src/providers/madhhab.provider';
import { computeBlocking, HeirsInput, Madhhab } from '@mizan/shared';
import { Ionicons } from '@expo/vector-icons';

function AccordionSection({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons 
          name={open ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.secondaryLight} 
        />
      </TouchableOpacity>
      {open && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

function getBlockingReasonLabel(key: keyof HeirsInput, heirs: HeirsInput): string | undefined {
  switch (key) {
    case 'paternalGrandfathers':
      return 'Blocked by Father';
    case 'paternalGrandmothers':
      return heirs.mother > 0 ? 'Blocked by Mother' : 'Blocked by Father';
    case 'maternalGrandmothers':
      return 'Blocked by Mother';
    case 'fullBrothers':
    case 'fullSisters':
      return heirs.sons > 0 ? 'Blocked by Son' : 'Blocked by Father';
    case 'paternalHalfBrothers':
    case 'paternalHalfSisters':
      if (heirs.sons > 0) return 'Blocked by Son';
      if (heirs.father > 0) return 'Blocked by Father';
      if (heirs.fullBrothers > 0) return 'Blocked by Full Brother';
      return 'Blocked by Paternal Grandfather';
    case 'maternalHalfSiblings':
      if (heirs.sons > 0 || heirs.daughters > 0) return 'Blocked by Children';
      if (heirs.father > 0) return 'Blocked by Father';
      return 'Blocked by Paternal Grandfather';
    case 'sonsOfFullBrothers':
      if (heirs.fullBrothers > 0) return 'Blocked by Full Brother';
      if (heirs.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      if (heirs.sons > 0) return 'Blocked by Son';
      return 'Blocked by Father';
    case 'sonsOfPatHalfBrothers':
      if (heirs.sonsOfFullBrothers > 0) return "Blocked by Full Brother's Son";
      if (heirs.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      return 'Blocked by Full Brother';
    case 'paternalUncles':
      if (heirs.sonsOfFullBrothers > 0) return "Blocked by Brother's Son";
      if (heirs.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      if (heirs.fullBrothers > 0) return 'Blocked by Full Brother';
      return 'Blocked by Father / Grandfather';
    case 'sonsOfPatUncles':
      if (heirs.paternalUncles > 0) return 'Blocked by Paternal Uncle';
      return "Blocked by Uncle's nearer relative";
    default:
      return 'Blocked';
  }
}

export default function InheritanceStep2() {
  const router = useRouter();
  const { heirs, setHeirCount } = useInheritanceStore();
  const madhhabCode = useSettingsStore((s) => s.madhhab);
  const activeMadhhab = MadhhabProvider.getActiveMadhhab();

  const blocking = computeBlocking(heirs, activeMadhhab);

  const handleNext = () => {
    router.push('/inheritance/summary');
  };

  const handleIncrement = (heir: keyof HeirsInput) => {
    setHeirCount(heir, heirs[heir] + 1);
  };

  const handleDecrement = (heir: keyof HeirsInput) => {
    if (heirs[heir] > 0) {
      setHeirCount(heir, heirs[heir] - 1);
    }
  };

  const renderCounter = (key: keyof HeirsInput, label: string, max?: number) => {
    const isBlocked = (blocking as any)[key] ?? false;
    const blockingReason = isBlocked ? getBlockingReasonLabel(key, heirs) : undefined;

    return (
      <HeirCounter
        key={key}
        label={label}
        count={heirs[key]}
        max={max}
        isBlocked={isBlocked}
        blockingReason={blockingReason}
        onIncrement={() => {
          if (key === 'husband' && heirs.wives > 0) setHeirCount('wives', 0);
          if (key === 'wives' && heirs.husband > 0) setHeirCount('husband', 0);
          handleIncrement(key);
        }}
        onDecrement={() => handleDecrement(key)}
      />
    );
  };

  return (
    <SafeScreen edges={['top', 'bottom', 'left', 'right']}>
      <Header title="Add Heirs" />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Step 2 of 4</Text>
          <StepIndicator
            currentStep={2}
            totalSteps={4}
            labels={['Estate', 'Heirs', 'Summary', 'Results']}
          />

          <View style={styles.card}>
            <AccordionSection title="Group 1 — Spouse" defaultOpen={true}>
              {renderCounter('husband', 'Husband', 1)}
              {renderCounter('wives', 'Wife(s)', 4)}
            </AccordionSection>

            <AccordionSection title="Group 2 — Children" defaultOpen={true}>
              {renderCounter('sons', 'Son(s)')}
              {renderCounter('daughters', 'Daughter(s)')}
            </AccordionSection>

            <AccordionSection title="Group 3 — Parents" defaultOpen={true}>
              {renderCounter('father', 'Father', 1)}
              {renderCounter('mother', 'Mother', 1)}
            </AccordionSection>

            <AccordionSection title="Group 4 — Grandparents" defaultOpen={false}>
              {renderCounter('paternalGrandfathers', 'Paternal Grandfather', 1)}
              {renderCounter('paternalGrandmothers', 'Paternal Grandmother', 1)}
              {renderCounter('maternalGrandmothers', 'Maternal Grandmother', 1)}
            </AccordionSection>

            <AccordionSection title="Group 5 — Siblings" defaultOpen={false}>
              {renderCounter('fullBrothers', 'Brother(s) - Full')}
              {renderCounter('fullSisters', 'Sister(s) - Full')}
              {renderCounter('paternalHalfBrothers', 'Half-Brother(s) (Paternal)')}
              {renderCounter('paternalHalfSisters', 'Half-Sister(s) (Paternal)')}
              {renderCounter('maternalHalfSiblings', 'Half-Sibling(s) (Maternal)')}
            </AccordionSection>

            <AccordionSection title="Group 6 — Extended Relatives" defaultOpen={false}>
              {renderCounter('sonsOfFullBrothers', 'Son(s) of Full Brothers')}
              {renderCounter('sonsOfPatHalfBrothers', 'Son(s) of Pat. Half-Brothers')}
              {renderCounter('paternalUncles', 'Paternal Uncle(s)')}
              {renderCounter('sonsOfPatUncles', 'Son(s) of Pat. Uncles')}
            </AccordionSection>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Next: Review Summary" onPress={handleNext} />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  stepTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  accordionContainer: {
    marginBottom: spacing.md,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  accordionTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 18,
    color: colors.secondaryLight,
  },
  accordionContent: {
    paddingTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
