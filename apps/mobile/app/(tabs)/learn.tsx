import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TOPICS = [
  { id: '1', title: 'Quran & Inheritance (Surah An-Nisa)', icon: 'book-outline' },
  { id: '2', title: 'Understanding Zakat', icon: 'cash-outline' },
  { id: '3', title: 'The 5 Pillars of Finance', icon: 'business-outline' },
  { id: '4', title: 'Nisab Explained', icon: 'home-outline' },
  { id: '5', title: 'Heir Priority Rules', icon: 'people-outline' },
  { id: '6', title: 'Wasiyyah (Islamic Will)', icon: 'document-text-outline' },
  { id: '7', title: 'Waqf & Endowments', icon: 'leaf-outline' },
  { id: '8', title: 'Ask the Scholar', icon: 'help-circle-outline' },
];

const FAQS = [
  { q: 'Why does a son inherit twice a daughter\'s share?', a: 'In Islamic finance, men carry the financial responsibility to provide for the family (Nafaqah). Thus, their larger share balances their legal obligations.' },
  { q: 'What is Nisab and how is it calculated?', a: 'Nisab is the minimum threshold of wealth a Muslim must hold for one lunar year before Zakat becomes due. It is equivalent to 85 grams of gold or 595 grams of silver.' },
  { q: 'Can non-Muslims inherit from a Muslim?', a: 'According to classical Islamic jurisprudence, religious difference prevents automatic inheritance, but up to 1/3 of the estate can be gifted via Wasiyyah (Will).' },
  { q: 'What is the difference between Zakat and Sadaqah?', a: 'Zakat is an obligatory alms-giving based on accumulated wealth, whereas Sadaqah is voluntary charity given at any time.' },
  { q: 'What is Kaffarah?', a: 'Kaffarah is an expiation or penalty for breaking a major Islamic rule (e.g., breaking a fast intentionally). It often involves feeding the poor or fasting.' },
  { q: 'Can I leave a will (Wasiyyah) in Islam?', a: 'Yes, you can bequeath up to 1/3 of your estate to non-heirs or charities. The remaining 2/3 must be distributed according to the fixed Islamic shares.' },
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.accordionQuestion}>{question}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.secondary} />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionBody}>
          <Text style={styles.accordionAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function LearnScreen() {
  const router = useRouter();

  const handleAskAssistant = (message: string) => {
    // Assuming AI tab accepts message via deep link
    router.push(`/(tabs)/ai?message=${encodeURIComponent(message)}` as any);
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header title="Learn" showBack={false} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Featured Article */}
        <TouchableOpacity style={styles.featuredCard} onPress={() => handleAskAssistant("Tell me about Islamic Inheritance (Mirath)")}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredBadge}>FEATURED</Text>
            <Text style={styles.featuredTitle}>Understanding Islamic Inheritance (Mirath)</Text>
            <Text style={styles.featuredDesc}>Learn the fundamentals of Faraid and how shares are calculated under Shariah law.</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>

        {/* Topics Grid */}
        <Text style={styles.sectionTitle}>Explore Topics</Text>
        <View style={styles.grid}>
          {TOPICS.map((topic) => (
            <TouchableOpacity 
              key={topic.id} 
              style={styles.topicCard}
              onPress={() => handleAskAssistant(`I want to learn about: ${topic.title}`)}
            >
              <View style={styles.topicIconContainer}>
                <Ionicons name={topic.icon as any} size={24} color={colors.secondary} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Accordion */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqSection}>
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </View>

        {/* Quick Reference Card */}
        <Text style={styles.sectionTitle}>Quick Reference: Fard Shares</Text>
        <View style={styles.referenceCard}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableCellHeader}>Heir</Text>
            <Text style={styles.tableCellHeaderRight}>W/ Child</Text>
            <Text style={styles.tableCellHeaderRight}>W/O Child</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Husband</Text>
            <Text style={styles.tableCellCenter}>1/4</Text>
            <Text style={styles.tableCellCenter}>1/2</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Wives</Text>
            <Text style={styles.tableCellCenter}>1/8</Text>
            <Text style={styles.tableCellCenter}>1/4</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Mother</Text>
            <Text style={styles.tableCellCenter}>1/6</Text>
            <Text style={styles.tableCellCenter}>1/3</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Father</Text>
            <Text style={styles.tableCellCenter}>1/6</Text>
            <Text style={styles.tableCellCenter}>Residue</Text>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.tableCell}>Daughter</Text>
            <Text style={styles.tableCellCenter}>1/2 (one)</Text>
            <Text style={styles.tableCellCenter}>—</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>
            MIZAN provides educational content only. Always consult a qualified Mufti for formal rulings.
          </Text>
        </View>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  featuredCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  featuredContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  featuredBadge: {
    fontFamily: (typography as any)?.bodyBold || 'System',
    fontSize: 10,
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  featuredTitle: {
    fontFamily: (typography as any)?.h3 || 'System',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featuredDesc: {
    fontFamily: (typography as any)?.bodyMedium || 'System',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: (typography as any)?.h3 || 'System',
    fontSize: 18,
    color: colors.cream,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  topicCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topicTitle: {
    fontFamily: (typography as any)?.bodySemiBold || 'System',
    fontSize: 14,
    color: colors.textPrimary,
  },
  faqSection: {
    marginBottom: spacing.xl,
  },
  accordionContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  accordionQuestion: {
    flex: 1,
    fontFamily: (typography as any)?.bodySemiBold || 'System',
    fontSize: 15,
    color: colors.textPrimary,
    paddingRight: spacing.md,
  },
  accordionBody: {
    padding: spacing.md,
    paddingTop: 0,
  },
  accordionAnswer: {
    fontFamily: (typography as any)?.bodyMedium || 'System',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  referenceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  tableCellHeader: {
    flex: 1,
    fontFamily: (typography as any)?.bodySemiBold || 'System',
    fontSize: 14,
    color: colors.textMuted,
  },
  tableCellHeaderRight: {
    flex: 1,
    fontFamily: (typography as any)?.bodySemiBold || 'System',
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    flex: 1,
    fontFamily: (typography as any)?.bodyMedium || 'System',
    fontSize: 14,
    color: colors.textPrimary,
  },
  tableCellCenter: {
    flex: 1,
    fontFamily: (typography as any)?.bodyMedium || 'System',
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  disclaimerText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: (typography as any)?.bodyMedium || 'System',
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  }
});
