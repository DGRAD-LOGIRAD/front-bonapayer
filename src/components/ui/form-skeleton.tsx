import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-96 mt-2' />
      </CardHeader>
      <CardContent className='space-y-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
        ))}
        <div className='flex gap-4 pt-4'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>
      </CardContent>
    </Card>
  );
}

