import { Skeleton } from '@/components/ui/skeleton';

export function PrevisualisationSkeleton() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='mb-4 px-4'>
        <Skeleton className='h-8 w-80 mx-auto' />
      </div>

      <div className='bg-gray-100 border-b border-gray-200 px-6 py-3'>
        <div className='flex flex-wrap gap-2 justify-center'>
          {[1, 2].map((i) => (
            <Skeleton key={i} className='h-8 w-24' />
          ))}
        </div>
      </div>

      <div className='h-[calc(100vh-120px)] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden m-4'>
        <div className='p-6 space-y-4'>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-8 w-64 mx-auto' />
          </div>

          <div className='space-y-4'>
            <div className='border border-gray-200 rounded'>
              <div className='bg-gray-50 p-2 border-b border-gray-200'>
                <Skeleton className='h-4 w-48' />
              </div>
              <div className='p-3 space-y-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='flex'>
                    <Skeleton className='h-3 w-32 mr-4' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                ))}
              </div>
            </div>

            <div className='border border-gray-200 rounded'>
              <div className='bg-gray-50 p-2 border-b border-gray-200'>
                <Skeleton className='h-4 w-56' />
              </div>
              <div className='p-3 space-y-2'>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className='flex'>
                    <Skeleton className='h-3 w-40 mr-4' />
                    <Skeleton className='h-3 w-52' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-8'>
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
      </div>
    </div>
  );
}

