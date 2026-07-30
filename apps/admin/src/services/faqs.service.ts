import { apiClient } from './api.client';

export const FAQsService = {
  getAll: async () => {
    const { data } = await apiClient.get('/admin/faqs');
    return data;
  },
  create: async (payload: any) => {
    const { data } = await apiClient.post('/admin/faqs', payload);
    return data;
  },
  update: async (id: string, payload: any) => {
    const { data } = await apiClient.put(`/admin/faqs/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/admin/faqs/${id}`);
    return data;
  }
};
