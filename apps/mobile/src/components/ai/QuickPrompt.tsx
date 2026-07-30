import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface QuickPromptProps {
  text: string;
  onPress: (text: string) => void;
}

export const QuickPrompt: React.FC<QuickPromptProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => onPress(text)} 
      style={styles.container}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  text: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.secondaryLight,
  },
});
