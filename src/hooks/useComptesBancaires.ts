import { useQuery } from '@tanstack/react-query';
import { apiService, type CompteBancaire } from '@/services/api';

export function useComptesBancaires() {
  return useQuery<CompteBancaire[]>({
    queryKey: ['comptes-bancaires'],
    queryFn: async () => {
      const response = await apiService.getComptesBancaires();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
