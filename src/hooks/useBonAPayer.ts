import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type CreateBonPayerPayload } from '@/services/api';

export const bonAPayerKeys = {
  all: ['bon-a-payers'] as const,
  details: (id: number) => [...bonAPayerKeys.all, 'details', id] as const,
  registres: (
    pagination: { pageSize: number; page: number },
    filters: {
      contribuableNif?: string;
      contribuableName?: string;
      reference_bon_a_payer_logirad?: string;
    }
  ) => [...bonAPayerKeys.all, 'registres', pagination, filters] as const,
};

export function useBonAPayer(id: number) {
  return useQuery({
    queryKey: bonAPayerKeys.details(id),
    queryFn: async () => {
      const response = await apiService.getBonPayerDetails(id);
      return response.data;
    },
    enabled: !!id && id > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({
        queryKey: bonAPayerKeys.all,
      });

      queryClient.prefetchQuery({
        queryKey: bonAPayerKeys.details(data.idBonPayer),
        queryFn: async () => {
          const response = await apiService.getBonPayerDetails(data.idBonPayer);
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });
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

export function useBonAPayerRegistres(
  pagination: { pageSize: number; page: number },
  filters: {
    contribuableNif?: string;
    contribuableName?: string;
    reference_bon_a_payer_logirad?: string;
  } = {}
) {
  return useQuery({
    queryKey: bonAPayerKeys.registres(pagination, filters),
    queryFn: () => apiService.getBonAPayerRegistres(pagination, filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiService.getBonAPayerRegistres(
        { pageSize: 100, page: 1 },
        {}
      );

      const data = response || [];

      const bonAPayerNonFractionne =
        data?.filter((item: { etat: number }) => item.etat !== 1)?.length || 0;
      const bonAPayeFractionne =
        data?.filter((item: { etat: number }) => item.etat === 1)?.length || 0;

      let totalUSD = 0;
      let totalCDF = 0;

      data?.forEach((item: { montant: number; devise: string }) => {
        const montant = Number(item.montant) || 0;
        if (item.devise === 'USD') {
          totalUSD += montant;
        } else if (item.devise === 'CDF') {
          totalCDF += montant;
        }
      });

      return {
        bonAPayerNonFractionne,
        bonAPayeFractionne,
        totalUSD,
        totalCDF,
      };
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useBonAPayerFractionnes() {
  return useQuery({
    queryKey: ['bon-a-payers-fractionnes'],
    queryFn: async () => {
      const response = await apiService.getBonAPayerRegistres(
        { pageSize: 100, page: 1 },
        {}
      );

      return response || [];
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useGetBonPayers(pageSize?: number, page?: number) {
  return useBonAPayerRegistres(
    { pageSize: pageSize || 10, page: page || 1 },
    {}
  );
}

export function useSearchBonAPayer() {
  return useMutation({
    mutationFn: (codeBonPayer: string) =>
      apiService.getBonPayerByCode(codeBonPayer),
  });
}
