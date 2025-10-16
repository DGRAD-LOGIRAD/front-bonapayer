import { Suspense, type ReactNode } from 'react';
import { Loading } from '@/components/ui/loading';

interface SuspenseWrapperProps {
  children: ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-[400px]'>
          <Loading size='lg' text='Chargement...' />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default SuspenseWrapper;
