import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type CompteBancaire } from '@/data/user';

interface CompteSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (compte: CompteBancaire) => void;
  comptes: CompteBancaire[];
  title: string;
}

export function CompteSelectionModal({
  isOpen,
  onClose,
  onSelect,
  comptes,
  title,
}: CompteSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBanque, setSelectedBanque] = useState<string>('');
  const [selectedDevise, setSelectedDevise] = useState<string>('');

  const banques = useMemo(() => {
    const uniqueBanques = Array.from(
      new Set(comptes.map(compte => compte.libellebanque))
    );
    return uniqueBanques;
  }, [comptes]);

  const devises = useMemo(() => {
    const uniqueDevises = Array.from(
      new Set(comptes.map(compte => compte.devise))
    );
    return uniqueDevises;
  }, [comptes]);

  const filteredComptes = useMemo(() => {
    return comptes.filter(compte => {
      const matchesSearch =
        compte.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compte.libellebanque.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBanque =
        selectedBanque === '' || compte.libellebanque === selectedBanque;
      const matchesDevise =
        selectedDevise === '' || compte.devise === selectedDevise;

      return matchesSearch && matchesBanque && matchesDevise;
    });
  }, [comptes, searchTerm, selectedBanque, selectedDevise]);

  const handleCompteSelect = (compte: CompteBancaire) => {
    onSelect(compte);
    onClose();
    setSearchTerm('');
    setSelectedBanque('');
    setSelectedDevise('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Filtres */}
          <div className='flex gap-3'>
            <div className='flex-1'>
              <Input
                placeholder='Rechercher par libellé ou banque...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='text-sm'
              />
            </div>
            <div className='w-48'>
              <select
                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={selectedBanque}
                onChange={e => setSelectedBanque(e.target.value)}
              >
                <option value=''>Toutes les banques</option>
                {banques.map(banque => (
                  <option key={banque} value={banque}>
                    {banque}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-24'>
              <select
                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={selectedDevise}
                onChange={e => setSelectedDevise(e.target.value)}
              >
                <option value=''>Toutes</option>
                {devises.map(devise => (
                  <option key={devise} value={devise}>
                    {devise}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des comptes */}
          <div className='max-h-96 overflow-y-auto'>
            <div className='grid gap-2'>
              {filteredComptes.map(compte => (
                <div
                  key={compte.id}
                  className='p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => handleCompteSelect(compte)}
                >
                  <div className='flex justify-between items-center'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 truncate'>
                        {compte.libelle}
                      </h4>
                      <p className='text-xs text-gray-500 truncate'>
                        {compte.libellebanque}
                      </p>
                      <p className='text-xs text-gray-400 font-mono mt-1'>
                        {compte.id}
                      </p>
                    </div>
                    <div className='flex gap-1 ml-2'>
                      <Badge variant='outline' className='text-xs px-2 py-1'>
                        {compte.devise}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredComptes.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                Aucun compte trouvé
              </div>
            )}
          </div>

          <div className='flex justify-end'>
            <Button variant='outline' onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
