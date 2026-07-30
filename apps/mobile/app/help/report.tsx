import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { supportService } from '../../src/services/support.service';
import { useTranslation } from '../../src/i18n/useTranslation';

type Category = 'BUG' | 'FEATURE' | 'FEEDBACK';

export default function ReportProblemScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const [category, setCategory] = useState<Category>('BUG');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: Array<{ id: Category; label: string; icon: string }> = [
    { id: 'BUG',      label: 'Bug Report 🐛',     icon: 'bug-outline' },
    { id: 'FEATURE',  label: 'Feature Request 💡', icon: 'bulb-outline' },
    { id: 'FEEDBACK', label: 'General Feedback 💬', icon: 'chatbox-ellipses-outline' },
  ];

  const handleSubmit = async () => {
    if (!subject.trim()) {
      setError('Please provide a subject line');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a detailed description');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await supportService.submitFeedback({
        category,
        subject: subject.trim(),
        description: description.trim(),
      });

      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your report has been submitted successfully. Our engineering team will review it shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      setIsSubmitting(false);
      Alert.alert('Submission Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header title={t('reportProblem')} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.subtitle}>
          Help us improve MIZAN. Report bugs, suggest new feature ideas, or share your feedback.
        </Text>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Category Selector */}
        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subject Input */}
        <Text style={styles.fieldLabel}>Subject</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.textInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder="Brief title of the issue or feature"
            placeholderTextColor={colors.textMuted}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Description Input */}
        <Text style={styles.fieldLabel}>Detailed Description</Text>
        <View style={[styles.inputBox, styles.textAreaBox]}>
          <TextInput
            style={[styles.textInput, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder="Explain what happened or what you would like to see..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Screenshot Placeholder */}
        <TouchableOpacity style={styles.uploadCard} activeOpacity={0.8}>
          <Ionicons name="image-outline" size={24} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>Attach Screenshot (Optional)</Text>
            <Text style={styles.uploadSub}>Supported formats: PNG, JPG (Max 5MB)</Text>
          </View>
          <Ionicons name="add" size={20} color={colors.secondary} />
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.primaryDark} />
          ) : (
            <Text style={styles.submitBtnText}>{t('submit')}</Text>
          )}
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
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 62, 62, 0.15)',
    padding: 12,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(229, 62, 62, 0.3)',
  },
  errorText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.error,
  },
  fieldLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
  },
  categoryText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryTextSelected: {
    color: colors.secondary,
  },
  inputBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  textAreaBox: {
    paddingVertical: 12,
  },
  textInput: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.white,
  },
  textArea: {
    height: 120,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.xl,
    gap: 12,
  },
  uploadTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
  },
  uploadSub: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.primaryDark,
  },
});
