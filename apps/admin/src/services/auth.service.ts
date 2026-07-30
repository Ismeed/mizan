import { apiClient } from './api.client';

export const AuthService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/admin/auth/login', { email, password });
    return data;
  }
};
