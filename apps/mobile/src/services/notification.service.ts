/**
 * Mobile notification service — MIZAN
 * Handles FCM token registration and in-app notifications via the API.
 */
import { apiClient } from './api.client';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, string>;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  /**
   * Register the device's FCM push token with the backend.
   * Call this after Expo Notifications.getExpoPushTokenAsync() or FCM.getToken().
   */
  registerToken: async (fcmToken: string, platform: 'ios' | 'android'): Promise<void> => {
    try {
      await apiClient.post('/notifications/register-token', { fcmToken, platform });
    } catch {
      // Non-critical — silently fail
    }
  },

  /**
   * Fetch in-app notifications for the authenticated user.
   */
  getNotifications: async (page = 1): Promise<{
    notifications: AppNotification[];
    unreadCount: number;
    total: number;
  }> => {
    const response = await apiClient.get('/notifications', { params: { page, limit: 20 } });
    return response.data.data;
  },

  /**
   * Mark a single notification as read.
   */
  markRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read.
   */
  markAllRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};
