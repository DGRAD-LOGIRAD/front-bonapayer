import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useBonAPayer, useCreateBonAPayer } from '../useBonAPayer';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

// Wrapper pour les tests avec QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useBonAPayer', () => {
  it('should fetch bon à payer details successfully', async () => {
    const { result } = renderHook(() => useBonAPayer(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.nomContribuable).toBe(
      'CONGO DONGFANG INTERNATIONAL MINING CDM'
    );
    expect(result.current.data?.montant).toBe(688.5);
  });

  it('should handle error when bon à payer not found', async () => {
    const { result } = renderHook(() => useBonAPayer(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should not fetch when id is 0', () => {
    const { result } = renderHook(() => useBonAPayer(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useCreateBonAPayer', () => {
  it('should create bon à payer successfully', async () => {
    const { result } = renderHook(() => useCreateBonAPayer(), {
      wrapper: createWrapper(),
    });

    const testPayload = {
      numero: 'TEST/DGRAD/2024',
      montant: '100.0000',
      dateEcheance: '2024-12-31',
      motifPenalite: 'Test de pénalité',
      refenceLogirad: 'TEST123456',
      codeReceveur: '522-800',
      userName: 'KASHALA',
      fkUserCreate: '1',
      fkContribuable: 'NIF20AC11109',
      fkCompte: '00011-00101-000001291036-41',
      fkCompteA: '0001300001003003081',
      fkCompteB: '00013000010030030810440',
      fkActe: '26403',
      fkDevise: 'USD',
      fkNotePerception: '359176',
      fkSite: '37783',
      fkVille: '19009',
      fkProvince: '2386',
    };

    result.current.mutate(testPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.code).toBe('200');
    expect(result.current.data?.idBonPayer).toBe(1);
  });

  it('should handle creation error', async () => {
    // Mock d'une erreur serveur
    server.use(
      http.post('/api/fractionnerBonPayer', () => {
        return HttpResponse.json(
          { message: 'Erreur serveur' },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useCreateBonAPayer(), {
      wrapper: createWrapper(),
    });

    const testPayload = {
      numero: 'TEST/DGRAD/2024',
      montant: '100.0000',
      dateEcheance: '2024-12-31',
      motifPenalite: 'Test de pénalité',
      refenceLogirad: 'TEST123456',
      codeReceveur: '522-800',
      userName: 'KASHALA',
      fkUserCreate: '1',
      fkContribuable: 'NIF20AC11109',
      fkCompte: '00011-00101-000001291036-41',
      fkCompteA: '0001300001003003081',
      fkCompteB: '00013000010030030810440',
      fkActe: '26403',
      fkDevise: 'USD',
      fkNotePerception: '359176',
      fkSite: '37783',
      fkVille: '19009',
      fkProvince: '2386',
    };

    result.current.mutate(testPayload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
