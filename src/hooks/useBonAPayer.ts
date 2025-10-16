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
      return response.data;
    },
    enabled: !!id && id > 0,
  });
}

export function useCreateBonAPayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBonPayerPayload) =>
      apiService.createBonPayer(payload),
    onSuccess: data => {
      // Invalider les requêtes liées aux bons à payer
      queryClient.invalidateQueries({
        queryKey: bonAPayerKeys.all,
      });

      // Pré-charger les détails du nouveau bon à payer
      queryClient.setQueryData(bonAPayerKeys.details(data.idBonPayer), {
        data: data,
        message: 'success',
        status: '200',
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
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}
