import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useBonAPayerRegistres } from '@/hooks/useBonAPayer';
import Datatable from '@/components/dashboard/datatable';
import TableSkeleton from '@/components/dashboard/table-skeleton';

function BonAPayersPage() {
  useEffect(() => {
    document.title = 'Bons à payer - DGRAD';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Liste et gestion des bons à payer');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Liste et gestion des bons à payer';
      document.head.appendChild(meta);
    }
  }, []);

  const [search, setSearch] = useState('');

  const {
    data: bonAPayers,
    isLoading,
    error,
    isError,
  } = useBonAPayerRegistres(
    { pageSize: 200, page: 1 },
    {}
  );

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Bons à payer</h2>
        </div>
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Rechercher...'
            className='pl-9 border-2 border-primary/60 focus-visible:border-primary'
          />
        </div>
      </div>

      {isLoading && <TableSkeleton />}

      {isError && (
        <div className='text-center py-8 text-red-600'>
          <div className='text-lg'>Erreur lors du chargement</div>
          <div className='text-sm mt-2'>{error?.message}</div>
        </div>
      )}

      {!isLoading && !isError && (
        <Datatable
          data={bonAPayers || []}
          globalFilter={search}
          title=''
          description=''
          ctaLabel='Fractionner un bon à payer'
        />
      )}
    </div>
  );
}

export default BonAPayersPage;
