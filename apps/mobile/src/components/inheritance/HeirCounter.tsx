import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

export interface HeirCounterProps {
  label: string;
  count: number;
  max?: number;
  isBlocked?: boolean;
  blockingReason?: string;
  description?: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const HeirCounter: React.FC<HeirCounterProps> = ({
  label,
  count,
  max,
  isBlocked,
  blockingReason,
  description,
  onIncrement,
  onDecrement,
}) => {
  const isMaxReached = max !== undefined && count >= max;
  const isMinReached = count <= 0;
  const disabled = isBlocked;

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <View style={styles.leftCol}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, disabled && styles.textDisabled]}>{label}</Text>
          {isBlocked && (
            <View style={styles.blockedPill}>
              <Text style={styles.blockedPillText}>BLOCKED</Text>
            </View>
          )}
        </View>
        {blockingReason ? (
          <Text style={styles.blockingReason}>{blockingReason}</Text>
        ) : null}
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      <View style={[styles.controls, disabled && styles.controlsDisabled]}>
        <TouchableOpacity
          onPress={onDecrement}
          disabled={disabled || isMinReached}
          style={[styles.button, (disabled || isMinReached) && styles.buttonDisabled]}
        >
          <Ionicons name="remove" size={20} color={disabled || isMinReached ? colors.textMuted : colors.white} />
        </TouchableOpacity>
        
        <Text style={[styles.count, disabled && styles.textDisabled]}>{count}</Text>
        
        <TouchableOpacity
          onPress={onIncrement}
          disabled={disabled || isMaxReached}
          style={[styles.button, (disabled || isMaxReached) && styles.buttonDisabled]}
        >
          <Ionicons name="add" size={20} color={disabled || isMaxReached ? colors.textMuted : colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  leftCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  label: {
    fontFamily: typography.bodySemiBold,
    fontSize: 16,
    color: colors.white,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  blockedPill: {
    backgroundColor: '#3b1c1c',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#5c2b2b',
  },
  blockedPillText: {
    color: '#ff6b6b',
    fontSize: 10,
    fontFamily: typography.bodyBold,
  },
  blockingReason: {
    fontFamily: typography.body,
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
  },
  description: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlsDisabled: {
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  count: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.secondary,
    width: 24,
    textAlign: 'center',
  },
});
