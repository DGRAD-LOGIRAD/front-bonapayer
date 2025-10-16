import { Suspense, type ReactNode } from 'react';
import { Loading } from '@/components/ui/loading';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingText?: string;
}

export function SuspenseWrapper({
  children,
  fallback,
  loadingText = 'Chargement...',
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className='flex items-center justify-center min-h-[400px]'>
      <Loading size='lg' text={loadingText} />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
