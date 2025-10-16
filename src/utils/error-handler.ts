import { type NavigateFunction } from 'react-router-dom';

export interface ApiError {
  status?: number;
  message?: string;
  code?: string;
}

export class ErrorHandler {
  static handleApiError(error: unknown, navigate: NavigateFunction) {
    console.error('API Error:', error);

    // Vérifier si c'est une erreur HTTP
    if (this.isHttpError(error)) {
      const status = this.getErrorStatus(error);

      switch (status) {
        case 500:
        case 502:
        case 503:
        case 504:
          // Erreurs serveur - rediriger vers la page 500
          navigate('/500');
          break;
        case 404:
          // Page non trouvée - rediriger vers la page 404
          navigate('/404');
          break;
        case 401:
        case 403:
          // Erreurs d'authentification - rediriger vers login
          navigate('/auth/login');
          break;
        default:
          // Autres erreurs - afficher un message d'erreur générique
          console.error('Unhandled HTTP error:', status);
      }
    } else {
      // Erreur non-HTTP - laisser l'ErrorBoundary gérer
      throw error;
    }
  }

  static isHttpError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as ApiError).status === 'number'
    );
  }

  static getErrorStatus(error: unknown): number {
    if (this.isHttpError(error)) {
      return error.status || 500;
    }
    return 500;
  }

  static getErrorMessage(error: unknown): string {
    if (this.isHttpError(error)) {
      return error.message || "Une erreur inattendue s'est produite";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Une erreur inattendue s'est produite";
  }
}

// Hook pour utiliser le gestionnaire d'erreurs
export const useErrorHandler = (navigate: NavigateFunction) => {
  const handleError = (error: unknown) => {
    ErrorHandler.handleApiError(error, navigate);
  };

  return { handleError };
};
