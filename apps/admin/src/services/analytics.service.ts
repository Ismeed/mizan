import { apiClient } from './api.client';

export const AnalyticsService = {
  getStats: async () => {
    const { data } = await apiClient.get('/admin/analytics');
    return data;
  }
};
