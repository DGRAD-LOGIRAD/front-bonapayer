import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useBonAPayerRegistres } from '@/hooks/useBonAPayer';
import { useDebounce } from '@/hooks/use-debounce';
import Datatable from '@/components/dashboard/datatable';
import TableSkeleton from '@/components/dashboard/table-skeleton';
import type { BonAPayerSummary } from '@/components/dashboard/datatable';

function BonAPayersPage() {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<BonAPayerSummary[]>([]);

  const debouncedSearch = useDebounce(search, 300);

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

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredData(bonAPayers || []);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    const filtered = bonAPayers?.filter((item: BonAPayerSummary) => {
      const searchableFields = [
        item.numero,
        item.assujetti.NIF,
        item.assujetti.nom_ou_raison_sociale,
        item.motif,
        item.centre.nom,
        item.centre.ville.nom,
        item.centre.ville.province.nom,
      ];

      return searchableFields.some(field =>
        field.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered || []);
  }, [debouncedSearch, bonAPayers]);

  useEffect(() => {
    if (bonAPayers && bonAPayers.length > 0 && filteredData?.length === 0) {
      setFilteredData(bonAPayers || []);
    }
  }, [bonAPayers, filteredData]);

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
            placeholder='Rechercher par numéro, NIF, nom, motif...'
            className='pl-9'
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

      {!isLoading && !isError && bonAPayers && (
        <>
          <div className='mb-4'>
            <div className='flex items-center justify-between'>
              {search && (
                <div className='text-sm text-muted-foreground'>
                  {filteredData?.length} résultat(s) trouvé(s) sur{' '}
                  {bonAPayers?.length}
                </div>
              )}
            </div>
          </div>

          <Datatable
            data={bonAPayers}
            title='Tous les bons à payer'
            description='Liste complète des bons à payer avec possibilité de recherche et consultation détaillée.'
            ctaLabel='Fractionner un bon à payer'
          />
        </>
      )}
    </div>
  );
}

export default BonAPayersPage;
