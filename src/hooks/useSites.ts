import { useQuery } from '@tanstack/react-query';
import { apiService, type Site } from '@/services/api';

export function useSites() {
  return useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const response = await apiService.getSites();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
