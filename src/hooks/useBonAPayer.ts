import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimistic } from 'react';
import { apiService, type CreateBonPayerPayload } from '@/services/api';
import type { BonAPayerSummary } from '@/components/dashboard/datatable';

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
    enabled: !!id && id > 0 && !isNaN(id),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateBonAPayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBonPayerPayload) =>
      apiService.createBonPayer(payload),
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey: bonAPayerKeys.all });

      const previousData = queryClient.getQueryData<BonAPayerSummary[]>(
        bonAPayerKeys.all
      );

      const optimisticItem: BonAPayerSummary = {
        id: Date.now(),
        etat: 0,
        numero: newData.numero,
        motif: newData.motifPenalite || '',
        montant: Number(newData.montant) || 0,
        devise: 'CDF',
        createdAt: new Date().toISOString(),
        assujetti: {
          nom_ou_raison_sociale: '',
          NIF: '',
        },
        centre: {
          nom: '',
          ville: {
            nom: '',
            province: {
              nom: '',
            },
          },
        },
      };

      queryClient.setQueryData<BonAPayerSummary[]>(
        bonAPayerKeys.all,
        (old = []) => [optimisticItem, ...old]
      );

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(bonAPayerKeys.all, context.previousData);
      }
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: bonAPayerKeys.all,
        refetchType: 'none',
      });

      const existingData = queryClient.getQueryData(
        bonAPayerKeys.details(data.idBonPayer)
      );
      
      if (!existingData) {
        queryClient.prefetchQuery({
          queryKey: bonAPayerKeys.details(data.idBonPayer),
          queryFn: async () => {
            const response = await apiService.getBonPayerDetails(data.idBonPayer);
            return response.data;
          },
          staleTime: 5 * 60 * 1000,
        });
      }
    },
  });
}

export function useBonAPayersOptimistic(initialData: BonAPayerSummary[] = []) {
  const { data } = useBonAPayerFractionnes();
  const currentData = data || initialData;

  const [optimisticData, addOptimistic] = useOptimistic(
    currentData,
    (state, newItem: BonAPayerSummary) => [newItem, ...state]
  );

  return { data: optimisticData, addOptimistic };
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
    if (!id || id <= 0 || isNaN(id)) return;
    
    queryClient.prefetchQuery({
      queryKey: bonAPayerKeys.details(id),
      queryFn: async () => {
        const response = await apiService.getBonPayerDetails(id);
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
    }).catch(() => {
      // Ignorer les erreurs de prefetch silencieusement
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
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useBonAPayerFractionnes() {
  return useQuery({
    queryKey: ['bon-a-payers-fractionnes'],
    queryFn: async () => {
      const response = await apiService.getBonAPayerRegistres(
        { pageSize: 200, page: 1 },
        {}
      );

      return response || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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
