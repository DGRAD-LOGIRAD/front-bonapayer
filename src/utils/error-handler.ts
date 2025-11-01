import { type NavigateFunction } from 'react-router-dom';

export interface ApiError {
  status?: number;
  message?: string;
  code?: string;
}

export class ErrorHandler {
  static handleApiError(error: unknown, navigate: NavigateFunction) {
    if (this.isHttpError(error)) {
      const status = this.getErrorStatus(error);

      switch (status) {
        case 500:
        case 502:
        case 503:
        case 504:
          navigate('/500');
          break;
        case 404:
          navigate('/404');
          break;
        case 401:
        case 403:
          navigate('/auth/login');
          break;
      }
    } else {
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

export const useErrorHandler = (navigate: NavigateFunction) => {
  const handleError = (error: unknown) => {
    ErrorHandler.handleApiError(error, navigate);
  };

  return { handleError };
};
