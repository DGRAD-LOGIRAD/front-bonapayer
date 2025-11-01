import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export function DetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-8 w-64' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-64 mb-4' />
          <div className='text-center'>
            <Skeleton className='h-4 w-48 mx-auto mb-3' />
            <Skeleton className='h-12 w-64 mx-auto' />
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-full' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-full' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>

          <div className='pt-4 border-t space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-full' />
              </div>
            </div>
          </div>

          <div className='pt-4 border-t'>
            <Skeleton className='h-4 w-32 mb-2' />
            <Skeleton className='h-20 w-full' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='space-y-4'>
          {[1, 2].map((i) => (
            <div key={i} className='border rounded-lg p-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-6 w-20' />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-5 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-5 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-5 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-5 w-full' />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

