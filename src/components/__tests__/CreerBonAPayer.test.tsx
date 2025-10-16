import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CreerBonAPayerPage from '../../pages/dashboard/bon-a-payers/creer';

// Mock du navigateur
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CreerBonAPayerPage Integration', () => {
  it('should render form with all required fields', () => {
    render(<CreerBonAPayerPage />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/numéro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/montant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date d'échéance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/motif de la pénalité/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/référence logirad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code receveur/i)).toBeInTheDocument();
  });

  it('should render all form sections', () => {
    render(<CreerBonAPayerPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Identifiants')).toBeInTheDocument();
    expect(screen.getByText('Montants et actes')).toBeInTheDocument();
    expect(screen.getByText('Comptes bancaires')).toBeInTheDocument();
    expect(screen.getByText('Références administratives')).toBeInTheDocument();
    expect(screen.getByText('Agent et localisation')).toBeInTheDocument();
  });

  it('should render submit and reset buttons', () => {
    render(<CreerBonAPayerPage />, { wrapper: createWrapper() });

    expect(
      screen.getByRole('button', { name: /créer le bon à payer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /réinitialiser/i })
    ).toBeInTheDocument();
  });
});
