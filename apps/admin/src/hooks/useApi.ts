import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';

export function useApiQuery<T>(key: string[], url: string, options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get(url);
      return data;
    },
    ...options
  });
}

export function useApiMutation<TData, TVariables>(
  method: 'post' | 'put' | 'delete' | 'patch',
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient[method](url, variables);
      return data;
    },
    ...options
  });
}
