import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface SourceCitationProps {
  source: string;
  reference: string;
  onPress?: () => void;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ source, reference, onPress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={onPress ? 0.7 : 1} 
      onPress={onPress} 
      style={styles.container}
      disabled={!onPress}
    >
      <Ionicons name="book" size={12} color={colors.secondary} style={styles.icon} />
      <Text style={styles.text}>
        {source}: <Text style={styles.reference}>{reference}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    marginLeft: 40,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.textSecondary,
  },
  reference: {
    fontFamily: typography.bodySemiBold,
    color: colors.secondaryLight,
  },
});
