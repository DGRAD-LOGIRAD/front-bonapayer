import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Loading } from '@/components/ui/loading';
import { ErrorDebug } from '@/components/ui/error-debug';
import { useBonAPayer } from '@/hooks/useBonAPayer';

function BonAPayerDetailsPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const bonAPayerId = documentId ? parseInt(documentId) : 0;
  const { data, isLoading, error, isError } = useBonAPayer(bonAPayerId);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loading size='lg' text='Chargement des détails...' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <p className='text-muted-foreground mb-4'>
            Erreur lors du chargement des détails
          </p>
          <Button onClick={() => navigate('/bon-a-payers')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Retour à la liste
          </Button>
        </div>
        {error && (
          <ErrorDebug
            error={error as Error}
            title='Erreur lors du chargement'
          />
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground mb-4'>Bon à payer non trouvé</p>
        <Button onClick={() => navigate('/bon-a-payers')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    const currency = data.fkDevise || 'USD';
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

    const currencyMap: { [key: string]: string } = {
      USD: 'USD',
      CDF: 'CDF',
      usd: 'USD',
      cdf: 'CDF',
    };

    const currencyCode = currencyMap[currency] || currency;

    return `${formattedAmount} ${currencyCode}`;
  };

  const handlePrint = () => {
    navigate(`/dashboard/bon-a-payers/${bonAPayerId}/previsualisation`);
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigate('/dashboard/bon-a-payers')}
                className='text-gray-500 hover:text-gray-700 flex-shrink-0'
              >
                <ArrowLeft className='h-4 w-4 mr-1' />
                <span className='hidden sm:inline'>Retour</span>
              </Button>
              <div className='h-4 w-px bg-gray-300 hidden sm:block' />
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg sm:text-xl md:text-2xl font-semibold text-primary truncate'>
                  Bon à payer Nº {data.refernceLogirad}
                </h1>

              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePrint}
              className='bg-primary text-white hover:bg-primary/90 hover:text-white flex-shrink-0 w-full sm:w-auto'
            >
              <Printer className='h-4 w-4 mr-2' />
              Imprimer
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6'>
        <div className='space-y-4 sm:space-y-6'>
          <div className='border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8'>
            <h3 className='text-sm sm:text-base font-bold text-primary uppercase tracking-wide mb-4 sm:mb-6'>
              Bon à payer principal (60 % des pénalités)
            </h3>

            <div className='text-center mb-6 sm:mb-8'>
              <h4 className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 sm:mb-3'>
                Montant total à payer
              </h4>
              <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-balance break-words px-2'>
                {formatCurrency(data.montant)}
              </p>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                  <p className='text-xs text-gray-500'>Contribuable</p>
                  <p className='text-sm font-medium text-gray-900 break-words'>
                    {data.nomContribuable}
                  </p>
                  <p className='text-xs text-gray-500 font-mono break-all'>
                    NIF: {data.fkContribuable}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Acte générateur</p>
                  <p className='text-sm font-medium text-gray-900 break-words'>
                    {data.libelleActe}
                  </p>
                  <p className='text-xs text-gray-500 font-mono break-all'>
                    Code: {data.fkActe}
                  </p>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Date d'échéance</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.dateEcheance}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Créé le</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.dateCreate}
                    </p>
                  </div>
                  <div className='sm:col-span-2 lg:col-span-1'>
                    <p className='text-xs text-gray-500'>Utilisateur</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.nomUtilisateur}
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Province</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.libelleProvince}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Ville</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.libelleVille}
                    </p>
                  </div>
                  <div className='sm:col-span-2 lg:col-span-1'>
                    <p className='text-xs text-gray-500'>Site</p>
                    <p className='text-sm font-medium text-gray-900 break-words'>
                      {data.libelleSite}
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-xs text-gray-500'>Compte principal</p>
                    <p className='text-sm font-mono text-gray-900 break-all'>
                      {data.fkCompte}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500'>Code receveur</p>
                    <p className='text-sm font-mono text-gray-900 break-all'>
                      {data.codeReceveur}
                    </p>
                  </div>
                  <div className='sm:col-span-2 lg:col-span-1'>
                    <p className='text-xs text-gray-500'>LOGIRAD</p>
                    <p className='text-sm font-mono text-gray-900 break-all'>
                      {data.refernceLogirad}
                    </p>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t border-gray-200'>
                <p className='text-xs text-gray-500 mb-2'>
                  Motif de la pénalité
                </p>
                <p className='text-sm text-gray-700 bg-gray-50 rounded p-3'>
                  {data.motifPenalite}
                </p>
              </div>
            </div>
          </div>

          {data.detailsBonPayerList && data.detailsBonPayerList.length > 0 && (
            <div className='border border-gray-200 rounded-lg p-4 sm:p-6'>
              <h3 className='text-sm sm:text-base font-bold text-primary uppercase tracking-wide mb-4 sm:mb-6'>
                Détail des fractions ({data.detailsBonPayerList.length})
              </h3>
              <div className='space-y-3 sm:space-y-4'>
                {data.detailsBonPayerList.map(
                  (detail: unknown, index: number) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-3 sm:p-4'
                    >
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2'>
                        <h4 className='text-sm font-bold text-gray-900'>
                          BON À PAYER  #{(detail as { typeBonPayer: number }).typeBonPayer === 1 ? 'A' : 'B'}
                        </h4>
                        <span className='text-xs bg-gray-100 px-2 py-1 rounded font-mono self-start sm:self-auto'>
                          Type{' '}
                          {(detail as { typeBonPayer: number }).typeBonPayer === 1 ? 'A' : 'B'} :
                          {(detail as { typeBonPayer: number }).typeBonPayer ===
                            1
                            ? '2/3'
                            : '1/3'}
                        </span>
                      </div>

                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>Montant</p>
                          <p className='text-sm font-bold text-primary break-words'>
                            {formatCurrency(
                              (detail as { montant: number }).montant
                            )}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>
                            Libellé du compte
                          </p>
                          <p className='text-sm font-medium text-gray-900 break-words'>
                            {
                              (detail as { libelleCompte: string })
                                .libelleCompte
                            }
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>Compte</p>
                          <p className='text-sm font-mono text-gray-900 break-all'>
                            {(detail as { fkCompte: string }).fkCompte}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 mb-1'>
                            Référence
                          </p>
                          <p className='text-xs font-mono text-gray-600 break-all'>
                            {(detail as { refernceBonMere: string }).refernceBonMere}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BonAPayerDetailsPage;
