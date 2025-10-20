import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useBonAPayerRegistres } from '@/hooks/useBonAPayer';

function BonAPayersPage() {
  const [search, setSearch] = useState('');
  const {
    data: bonAPayers,
    isLoading,
    error,
    isError,
  } = useBonAPayerRegistres(
    { pageSize: 10, page: 1 },
    {
      contribuableNif: '*',
      contribuableName: '*',
      reference_bon_a_payer_logirad: '*',
    }
  );

  console.log('Hook state:', { bonAPayers, isLoading, error, isError });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Bons à payer</h2>
          <p className='text-muted-foreground'>
            Gérez et consultez tous les bons à payer enregistrés dans le
            système.
          </p>
        </div>
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Rechercher par numéro ou NIF'
            className='pl-9'
          />
        </div>
      </div>

      {isLoading && (
        <div className='text-center py-8'>
          <div className='text-lg'>Chargement des registres...</div>
        </div>
      )}

      {isError && (
        <div className='text-center py-8 text-red-600'>
          <div className='text-lg'>Erreur lors du chargement</div>
          <div className='text-sm mt-2'>{error?.message}</div>
        </div>
      )}

      {bonAPayers && (
        <div>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>Données récupérées :</h3>
            <p>Total: {bonAPayers.metaData?.total || 0} registres</p>
            <p>
              Page: {bonAPayers.metaData?.page || 0} /{' '}
              {Math.ceil(
                (bonAPayers.metaData?.total || 0) /
                  (bonAPayers.metaData?.pagination || 10)
              )}
            </p>
          </div>
          <pre className='text-black text-xs overflow-auto max-h-96 bg-gray-100 p-4 rounded'>
            {JSON.stringify(bonAPayers, null, 2)}
          </pre>
        </div>
      )}

      {/* <Datatable
        data={filteredBonAPayers}
        title='Tous les bons à payer'
        description='Liste complète des bons à payer avec possibilité de recherche et consultation détaillée.'
        ctaLabel='Fractionner un bon à payer'
      /> */}
    </div>
  );
}

export default BonAPayersPage;
