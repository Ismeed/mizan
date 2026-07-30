import { apiClient } from './api.client';

export const UsersService = {
  getAll: async () => {
    const { data } = await apiClient.get('/admin/users');
    return data;
  },
  suspend: async (id: string) => {
    const { data } = await apiClient.put(`/admin/users/${id}/suspend`);
    return data;
  }
};
