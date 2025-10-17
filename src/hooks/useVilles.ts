import { useQuery } from '@tanstack/react-query';
import { apiService, type Ville } from '@/services/api';

export function useVilles(idProvince: string | null) {
  return useQuery<Ville[]>({
    queryKey: ['villes', idProvince],
    queryFn: async () => {
      if (!idProvince) return [];
      const response = await apiService.getVilles(idProvince);
      return response.data;
    },
    enabled: !!idProvince, // Ne s'exécute que si idProvince est fourni
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
