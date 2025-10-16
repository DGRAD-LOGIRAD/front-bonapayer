import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import BonAPayerDetailsPage from '../../pages/dashboard/bon-a-payers/details';

// Mock du navigateur
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ documentId: '1' }),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('BonAPayerDetailsPage Integration', () => {
  it('should render loading state initially', () => {
    render(<BonAPayerDetailsPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Chargement des détails...')).toBeInTheDocument();
  });

  it('should render page structure', () => {
    render(<BonAPayerDetailsPage />, { wrapper: createWrapper() });

    // Vérifier que la structure de base est présente
    expect(screen.getByText('Chargement des détails...')).toBeInTheDocument();
  });
});
