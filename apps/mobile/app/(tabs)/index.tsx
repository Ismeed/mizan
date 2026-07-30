import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { QuickActionCard } from '../../src/components/home/QuickActionCard';
import { ComingSoonTool } from '../../src/components/home/ComingSoonTool';
import { Logo } from '../../src/components/ui/Logo';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Logo size={36} showText={false} layout="horizontal" />
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.white} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Assalamu Alaikum, {user?.name || 'User'} 👋</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <QuickActionCard
            title="Inheritance (Mirath)"
            description="Calculate heirs' shares & distribution"
            icon="people"
            onPress={() => router.push('/inheritance')}
          />
          <QuickActionCard
            title="Zakat Calculator"
            description="Calculate your zakat accurately"
            icon="cash"
            onPress={() => router.push('/zakat')}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>More Tools (Coming Soon)</Text>
          <View style={styles.toolsGrid}>
            <View style={styles.toolColumn}>
              <ComingSoonTool title="Will (Wasiyyah)" />
              <View style={styles.toolSpacer} />
              <ComingSoonTool title="Diyah (Blood Money)" />
              <View style={styles.toolSpacer} />
              <ComingSoonTool title="Fidyah Calculator" />
            </View>
            <View style={styles.toolColumn}>
              <ComingSoonTool title="Kaffarah Calculator" />
              <View style={styles.toolSpacer} />
              <ComingSoonTool title="Waqf & Endowment" />
              <View style={styles.toolSpacer} />
              <ComingSoonTool title="Halal Wealth Audit" />
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  greetingContainer: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontFamily: typography.heading,
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 18,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toolColumn: {
    flex: 1,
  },
  toolSpacer: {
    height: spacing.md,
  },
});
