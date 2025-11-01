import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='h-32 bg-white rounded-lg border border-gray-200 p-4 space-y-3'
          >
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </div>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-3 w-full' />
          </div>
        ))}
      </div>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-4 w-96' />
          </div>
          <Skeleton className='h-10 w-48' />
        </div>
        <div className='rounded-md border bg-white'>
          <div className='p-4 space-y-3'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-16 w-full' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

