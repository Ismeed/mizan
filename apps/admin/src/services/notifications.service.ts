import { apiClient } from './api.client';

export const NotificationsService = {
  broadcast: async (payload: { title: string; body: string; target: string }) => {
    const { data } = await apiClient.post('/admin/notifications/broadcast', payload);
    return data;
  }
};
