import { useQuery } from '@tanstack/react-query';
import { apiService, type Province } from '@/services/api';

export function useProvinces() {
  return useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await apiService.getProvinces();
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}
