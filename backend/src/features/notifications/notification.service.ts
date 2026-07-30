import { prisma } from '../../config/database';
import { PushNotificationService } from './push.service';

const pushService = new PushNotificationService();

export class NotificationService {
  /**
   * Get all notifications for a user (paginated).
   */
  async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { user_id: userId } }),
      prisma.notification.count({ where: { user_id: userId, is_read: false } }),
    ]);

    return { notifications, total, unreadCount, page, limit };
  }

  /**
   * Mark a specific notification as read.
   */
  async markRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true },
    });
  }

  /**
   * Mark ALL notifications as read for a user.
   */
  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  /**
   * Register a device FCM token.
   */
  async registerDeviceToken(userId: string, fcmToken: string, platform: 'ios' | 'android') {
    await pushService.registerToken(userId, fcmToken, platform);
    return { message: 'Device registered for notifications' };
  }

  /**
   * Send a Zakat reminder to a specific user.
   */
  async sendZakatReminder(userId: string) {
    await pushService.sendToUser(userId, {
      title: '🕌 Zakat Reminder',
      body: 'It\'s time to recalculate your annual Zakat. Open MIZAN to get started.',
      data: { type: 'ZAKAT_REMINDER', screen: '/zakat' },
    });
  }

  /**
   * Broadcast a Ramadan reminder to all users.
   */
  async sendRamadanBroadcast() {
    return pushService.broadcast({
      title: '🌙 Ramadan Mubarak!',
      body: 'Don\'t forget to calculate your Zakat al-Fitr before Eid prayer.',
      data: { type: 'RAMADAN_REMINDER', screen: '/zakat' },
    });
  }

  /**
   * Admin broadcast to all users.
   */
  async adminBroadcast(title: string, body: string, data?: Record<string, string>) {
    return pushService.broadcast({ title, body, data });
  }
}
