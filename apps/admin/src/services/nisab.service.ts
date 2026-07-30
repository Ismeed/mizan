import { apiClient } from './api.client';

export const NisabService = {
  getRates: async () => {
    const { data } = await apiClient.get('/admin/nisab');
    return data;
  },
  updateRate: async (payload: { gold: number; silver: number }) => {
    const { data } = await apiClient.put('/admin/nisab', payload);
    return data;
  }
};
