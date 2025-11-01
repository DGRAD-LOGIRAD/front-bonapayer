import { type ReactNode } from 'react';

interface QueryStateWrapperProps<T> {
  loading: boolean;
  error: Error | null;
  data: T | undefined;
  skeleton?: ReactNode;
  errorTitle?: string;
  emptyMessage?: string;
  showEmpty?: boolean;
  children: (data: T) => ReactNode;
}

export function QueryStateWrapper<T>({
  loading,
  error,
  data,
  skeleton,
  errorTitle = 'Erreur lors du chargement',
  emptyMessage = 'Aucune donnée disponible',
  showEmpty = false,
  children,
}: QueryStateWrapperProps<T>) {
  if (loading) {
    return skeleton ? <>{skeleton}</> : null;
  }

  if (error) {
    return (
      <div className='text-center py-8 text-red-600'>
        <div className='text-lg'>{errorTitle}</div>
        <div className='text-sm mt-2'>{error.message}</div>
      </div>
    );
  }

  if (showEmpty && !data) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <div className='text-lg'>{emptyMessage}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children(data)}</>;
}

