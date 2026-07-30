import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { supportService, FAQItem } from '../../src/services/support.service';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function HelpCenterScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_1');

  const faqs = supportService.getFaqs();

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@mizan.app?subject=MIZAN%20Support%20Inquiry');
  };

  const handleWhatsappSupport = () => {
    Linking.openURL('https://wa.me/2348000000000?text=Hello%20MIZAN%20Support');
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header title={t('helpCenter')} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={{ marginRight: 10 }} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('searchHelp')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Action Navigation Grid */}
        <View style={styles.quickGrid}>
          <TouchableOpacity 
            style={styles.quickCard} 
            onPress={() => router.push('/help/report')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ionicons name="bug-outline" size={22} color="#EF4444" />
            </View>
            <Text style={styles.quickTitle}>{t('reportProblem')}</Text>
            <Text style={styles.quickSub}>Bug reports & feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickCard} 
            onPress={() => router.push('/help/resources')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIconBg, { backgroundColor: 'rgba(201, 168, 76, 0.15)' }]}>
              <Ionicons name="book-outline" size={22} color={colors.secondary} />
            </View>
            <Text style={styles.quickTitle}>{t('educationalResources')}</Text>
            <Text style={styles.quickSub}>Guides & Fiqh basics</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('faqs')}</Text>

          <View style={styles.card}>
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedFaqId === faq.id;
              const isLast = index === filteredFaqs.length - 1;

              return (
                <View key={faq.id} style={[!isLast && styles.faqBorder]}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.faqQuestion, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {faq.question}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <Text style={[styles.faqAnswer, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            {filteredFaqs.length === 0 && (
              <View style={styles.emptyFaq}>
                <Ionicons name="help-circle-outline" size={36} color={colors.textMuted} />
                <Text style={styles.emptyText}>No matching support articles found.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contactSupport')}</Text>

          <View style={styles.card}>
            <TouchableOpacity style={styles.contactRow} onPress={handleEmailSupport} activeOpacity={0.7}>
              <View style={styles.contactIconBg}>
                <Ionicons name="mail-outline" size={20} color={colors.secondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{t('emailSupport')}</Text>
                <Text style={styles.contactSub}>support@mizan.app</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactRow} onPress={handleWhatsappSupport} activeOpacity={0.7}>
              <View style={[styles.contactIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <Ionicons name="logo-whatsapp" size={20} color="#22C55E" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{t('whatsappSupport')}</Text>
                <Text style={styles.contactSub}>Instant WhatsApp assistance</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.contactRow}>
              <View style={[styles.contactIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="chatbubbles-outline" size={20} color="#6366F1" />
              </View>
              <View style={styles.contactInfo}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.contactTitle}>{t('liveChat')}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>COMING SOON</Text>
                  </View>
                </View>
                <Text style={styles.contactSub}>In-app live chat support</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.contactRow}>
              <View style={styles.contactIconBg}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{t('phoneSupport')}</Text>
                <Text style={styles.contactSub}>+1 (800) MIZAN-APP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* About App Banner */}
        <TouchableOpacity 
          style={styles.aboutCard} 
          onPress={() => router.push('/help/about')}
          activeOpacity={0.8}
        >
          <View style={styles.aboutLeft}>
            <Ionicons name="information-circle" size={24} color={colors.secondary} />
            <View>
              <Text style={styles.aboutTitle}>MIZAN v1.0.0 (Build 100)</Text>
              <Text style={styles.aboutSub}>Terms, Privacy & Open Source Licenses</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontFamily: typography.body,
    fontSize: 15,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    marginBottom: 2,
  },
  quickSub: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  faqBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: colors.white,
    marginRight: 10,
    lineHeight: 21,
  },
  faqBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  faqAnswer: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emptyFaq: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  contactIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    color: colors.white,
  },
  contactSub: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontFamily: typography.bodyBold,
    fontSize: 9,
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
  },
  aboutSub: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
