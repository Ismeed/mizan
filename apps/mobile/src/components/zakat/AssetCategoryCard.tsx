import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

interface AssetCategoryCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

export const AssetCategoryCard: React.FC<AssetCategoryCardProps> = ({
  title,
  icon,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={selected ? colors.primaryDark : colors.secondary} 
        />
      </View>
      <Text style={[styles.title, selected && styles.selectedTitle]}>{title}</Text>
      {selected && (
        <View style={styles.checkIcon}>
          <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    position: 'relative',
  },
  selectedContainer: {
    borderColor: colors.secondary,
    backgroundColor: colors.surfaceElevated,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  selectedIconContainer: {
    backgroundColor: colors.secondary,
  },
  title: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  selectedTitle: {
    color: colors.secondary,
  },
  checkIcon: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
