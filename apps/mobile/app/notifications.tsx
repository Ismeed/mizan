import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../src/components/layout/SafeScreen';
import { Header } from '../src/components/layout/Header';
import { colors } from '../src/constants/colors';
import { typography } from '../src/constants/typography';
import { spacing, borderRadius } from '../src/constants/spacing';

interface Notification {
  id: string;
  type: 'info' | 'alert' | 'success' | 'reminder';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Welcome to MIZAN',
    body: 'Assalamu Alaikum! Your account is ready. Begin by calculating Inheritance or Zakat.',
    time: 'Just now',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Zakat Due Reminder',
    body: 'Your Zakat calculation from last month may be due for review. Tap to recalculate.',
    time: '2 days ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Report Generated',
    body: 'Your Inheritance PDF report has been generated and is ready for download.',
    time: '1 week ago',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'System Update',
    body: 'MIZAN has been updated with improved Zakat calculation accuracy and new Nisab rates.',
    time: '2 weeks ago',
    read: true,
  },
];

const iconMap = {
  info:     { name: 'information-circle' as const, color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  alert:    { name: 'warning'            as const, color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  success:  { name: 'checkmark-circle'  as const, color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
  reminder: { name: 'alarm'             as const, color: colors.secondary, bg: 'rgba(201,168,76,0.12)' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header
        title="Notifications"
        onBack={() => router.back()}
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Ionicons name="notifications" size={14} color={colors.secondary} />
            <Text style={styles.unreadText}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={52} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyBody}>
              You're all caught up. Notifications will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((notif, index) => {
              const icon = iconMap[notif.type];
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.card,
                    !notif.read && styles.cardUnread,
                    index === notifications.length - 1 && { marginBottom: 0 },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => markRead(notif.id)}
                >
                  <View style={[styles.iconBg, { backgroundColor: icon.bg }]}>
                    <Ionicons name={icon.name} size={22} color={icon.color} />
                  </View>

                  <View style={styles.textBlock}>
                    <View style={styles.topRow}>
                      <Text style={styles.title} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      {!notif.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.body} numberOfLines={2}>
                      {notif.body}
                    </Text>
                    <Text style={styles.time}>{notif.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201,168,76,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  unreadText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.secondary,
  },
  markAllText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.secondary,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    borderColor: 'rgba(201,168,76,0.35)',
    backgroundColor: colors.surfaceElevated,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  title: {
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    marginRight: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    flexShrink: 0,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  time: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 18,
    color: colors.white,
  },
  emptyBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
