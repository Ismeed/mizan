import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

export const PremiumBanner: React.FC = () => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <LinearGradient
        colors={[colors.surfaceElevated, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Text style={styles.description}>
              Unlock unlimited offline calculations, advanced AI assistance, and detailed exportable reports.
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={32} color={colors.secondary} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  gradient: {
    padding: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontFamily: typography.headingMedium,
    fontSize: 16,
    color: colors.secondaryLight,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
