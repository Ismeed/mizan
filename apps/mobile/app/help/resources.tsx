import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { supportService, EducationalGuide } from '../../src/services/support.service';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function EducationalResourcesScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const [selectedGuide, setSelectedGuide] = useState<EducationalGuide | null>(null);

  const guides = supportService.getGuides();

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header title={t('educationalResources')} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.subtitle}>
          Explore authentic Islamic financial guides retrieved directly from the Application Knowledge RAG.
        </Text>

        <View style={styles.guideList}>
          {guides.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              onPress={() => setSelectedGuide(guide)}
              activeOpacity={0.7}
            >
              <View style={styles.iconBg}>
                <Ionicons name={guide.icon as any} size={24} color={colors.secondary} />
              </View>
              <View style={styles.guideInfo}>
                <Text style={[styles.guideTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {guide.title}
                </Text>
                <Text style={[styles.guideDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {guide.description}
                </Text>
                <View style={styles.refChip}>
                  <Ionicons name="bookmark-outline" size={12} color={colors.secondary} />
                  <Text style={styles.refText}>{guide.reference}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Guide Detail Modal */}
      <Modal
        visible={selectedGuide !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedGuide(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedGuide && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedGuide.title}</Text>
                    <Text style={styles.modalRef}>{selectedGuide.reference}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedGuide(null)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={{ marginTop: 16 }}>
                  <Text style={styles.guideContentText}>{selectedGuide.content}</Text>

                  <View style={styles.ragBox}>
                    <Ionicons name="sparkles" size={18} color={colors.secondary} />
                    <Text style={styles.ragText}>
                      Retrieved from MIZAN Verified Application Knowledge RAG & Shariah Standards.
                    </Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  guideList: {
    gap: spacing.md,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  guideInfo: {
    flex: 1,
    marginRight: spacing.xs,
  },
  guideTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.white,
    marginBottom: 4,
  },
  guideDesc: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },
  refChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refText: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    color: colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 20,
    color: colors.white,
  },
  modalRef: {
    fontFamily: typography.bodyBold,
    fontSize: 12,
    color: colors.secondary,
    marginTop: 2,
  },
  guideContentText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  ragBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  ragText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.secondary,
    lineHeight: 16,
  },
});
