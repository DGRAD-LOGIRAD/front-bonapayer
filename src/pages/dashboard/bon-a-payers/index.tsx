import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Datatable from '@/components/dashboard/datatable';
import { Input } from '@/components/ui/input';
import { bonAPayers } from '@/data/bon-a-payers';

function BonAPayersPage() {
  const [search, setSearch] = useState('');

  const filteredBonAPayers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bonAPayers;

    return bonAPayers.filter(item => {
      return (
        item.numero.toLowerCase().includes(term) ||
        item.assujetti.nom_ou_raison_sociale.toLowerCase().includes(term) ||
        item.assujetti.NIF.toLowerCase().includes(term)
      );
    });
  }, [search]);

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

      <Datatable
        data={filteredBonAPayers}
        title='Tous les bons à payer'
        description='Liste complète des bons à payer avec possibilité de recherche et consultation détaillée.'
        ctaLabel='Fractionner un bon à payer'
      />
    </div>
  );
}

export default BonAPayersPage;
