import { useQuery } from '@tanstack/react-query';
import { apiService, type Site } from '@/services/api';

export function useSites(idVille: string) {
  return useQuery<Site[]>({
    queryKey: ['sites', idVille],
    queryFn: async () => {
      const response = await apiService.getSites(idVille);
      return response.data;
    },
    enabled: !!idVille,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}
