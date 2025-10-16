import React, { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Appeler la fonction onError si fournie
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Utiliser le fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback par défaut
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='h-12 w-12 text-red-500' />
            </div>

            <h1 className='text-xl font-semibold text-gray-900 mb-2'>
              Oups ! Une erreur s'est produite
            </h1>

            <p className='text-gray-600 mb-6'>
              Une erreur inattendue s'est produite. Veuillez réessayer ou
              contacter le support si le problème persiste.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left'>
                <h3 className='text-sm font-medium text-red-800 mb-2'>
                  Détails de l'erreur :
                </h3>
                <pre className='text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32'>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className='flex gap-3 justify-center'>
              <Button
                onClick={this.handleRetry}
                className='flex items-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Réessayer
              </Button>

              <Button
                variant='outline'
                onClick={() => window.location.reload()}
              >
                Recharger la page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour utiliser l'ErrorBoundary dans les composants fonctionnels
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};
