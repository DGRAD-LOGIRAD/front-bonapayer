import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type CreateBonPayerPayload } from '@/services/api';

export const bonAPayerKeys = {
  all: ['bon-a-payers'] as const,
  details: (id: number) => [...bonAPayerKeys.all, 'details', id] as const,
};

export function useBonAPayer(id: number) {
  return useQuery({
    queryKey: bonAPayerKeys.details(id),
    queryFn: async () => {
      const response = await apiService.getBonPayerDetails(id);
      return response.data; // L'API retourne déjà { data: {...}, message: 'success', status: '200' }
    },
    enabled: !!id && id > 0,
    staleTime: 30 * 1000, // 30 secondes - données fraîches plus souvent
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    retry: 2,
    retryDelay: 1000,
  });
}

export function useCreateBonAPayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBonPayerPayload) =>
      apiService.createBonPayer(payload),
    onSuccess: data => {
      // Invalider toutes les requêtes liées aux bons à payer
      queryClient.invalidateQueries({
        queryKey: bonAPayerKeys.all,
      });

      // Précharger les données du bon à payer créé
      queryClient.prefetchQuery({
        queryKey: bonAPayerKeys.details(data.idBonPayer),
        queryFn: async () => {
          const response = await apiService.getBonPayerDetails(data.idBonPayer);
          return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },
    onError: error => {
      console.error('Erreur lors de la création du bon à payer:', error);
    },
  });
}

export function useRefreshBonAPayer() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.invalidateQueries({
      queryKey: bonAPayerKeys.details(id),
    });
  };
}

export function usePrefetchBonAPayer() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: bonAPayerKeys.details(id),
      queryFn: () => apiService.getBonPayerDetails(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
