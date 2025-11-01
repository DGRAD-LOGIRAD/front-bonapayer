import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useMemo, memo, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QueryStateWrapper } from '@/components/ui/query-state-wrapper';
import { DetailsSkeleton } from '@/components/dashboard/details-skeleton';
import { useBonAPayer } from '@/hooks/useBonAPayer';
import { formatCurrency } from '@/lib/utils';
import type { BonPayerDetail } from '@/services/api';

interface BonPayerFraction extends BonPayerDetail {
  typeBonPayer: number;
  refernceBonMere: string;
}

function BonAPayerDetailsPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const bonAPayerId = useMemo(() => {
    if (!documentId) return 0;
    const parsed = parseInt(documentId, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [documentId]);

  const { data, isLoading, error } = useBonAPayer(bonAPayerId);

  useEffect(() => {
    if (data) {
      document.title = `Bon à payer Nº ${data.refernceLogirad} - DGRAD`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          `Détails du bon à payer ${data.refernceLogirad} - ${data.nomContribuable}`
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = `Détails du bon à payer ${data.refernceLogirad} - ${data.nomContribuable}`;
        document.head.appendChild(meta);
      }
    }
  }, [data]);

  const fractions = useMemo(() => {
    if (!data?.detailsBonPayerList) return [];
    return data.detailsBonPayerList as BonPayerFraction[];
  }, [data]);

  const handlePrint = () => {
    navigate(`/dashboard/bon-a-payers/${bonAPayerId}/previsualisation`);
  };

  return (
    <div className='space-y-6'>
      <QueryStateWrapper
        loading={isLoading}
        error={error || null}
        data={data}
        skeleton={<DetailsSkeleton />}
        errorTitle='Erreur lors du chargement des détails'
        showEmpty={true}
        emptyMessage='Bon à payer non trouvé'
      >
        {(data) => (
          <>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => navigate('/dashboard/bon-a-payers')}
                  className='flex-shrink-0'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>Retour</span>
                </Button>
                <div className='h-6 w-px bg-border hidden sm:block' />
                <h1 className='text-xl sm:text-2xl font-semibold text-primary truncate'>
                  Bon à payer Nº {data.refernceLogirad}
                </h1>
              </div>
              <Button
                variant='default'
                size='sm'
                onClick={handlePrint}
                className='shrink-0 w-full sm:w-auto'
              >
                <Printer className='h-4 w-4 mr-2' />
                Imprimer
              </Button>
            </div>

            <Card className='border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
              <CardHeader className='px-4 pt-4 pb-2'>
                <CardTitle className='text-base font-bold text-primary uppercase tracking-wide'>
                  💰 Bon à payer principal (60 % des pénalités)
                </CardTitle>
              </CardHeader>
              <CardContent className='px-4 pb-4 pt-2 space-y-6'>
                <div className='text-center py-4 border-b border-primary/20'>
                  <CardDescription className='text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3'>
                    Montant total à payer
                  </CardDescription>
                  <p className='text-3xl sm:text-4xl md:text-5xl font-bold text-primary wrap-break-word px-2'>
                    {formatCurrency(data.montant, data.fkDevise as 'USD' | 'CDF')}
                  </p>
                </div>

                <Card className='border border-primary/30 bg-white/50'>
                  <CardHeader className='px-3 pt-3 pb-2'>
                    <CardTitle className='text-sm font-semibold text-primary'>
                      👤 Informations du contribuable
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='px-3 pb-3 pt-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Contribuable
                        </p>
                        <p className='text-sm font-medium wrap-break-word'>
                          {data.nomContribuable}
                        </p>
                        <p className='text-xs text-muted-foreground font-mono break-all mt-1'>
                          NIF: {data.fkContribuable}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Acte générateur
                        </p>
                        <p className='text-sm font-medium break-words'>
                          {data.libelleActe}
                        </p>
                        <p className='text-xs text-muted-foreground font-mono break-all mt-1'>
                          Code: {data.fkActe}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border border-primary/30 bg-white/50'>
                  <CardHeader className='px-3 pt-3 pb-2'>
                    <CardTitle className='text-sm font-semibold text-primary'>
                      📅 Informations administratives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='px-3 pb-3 pt-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Date d'échéance
                        </p>
                        <p className='text-sm font-medium wrap-break-word'>
                          {data.dateEcheance ? (data.dateEcheance) : data.dateEcheance}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>Créé le</p>
                        <p className='text-sm font-medium wrap-break-word'>
                          {data.dateCreate ? (data.dateCreate) : data.dateCreate}
                        </p>
                      </div>
                      <div className='sm:col-span-2 lg:col-span-1'>
                        <p className='text-xs text-muted-foreground mb-1'>Utilisateur</p>
                        <p className='text-sm font-medium wrap-break-word'>
                          {data?.detailsBonPayerList ? data?.detailsBonPayerList[0]?.nomUtilisateur : data.nomUtilisateur}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border border-primary/30 bg-white/50'>
                  <CardHeader className='px-3 pt-3 pb-2'>
                    <CardTitle className='text-sm font-semibold text-primary'>
                      🏢 Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='px-3 pb-3 pt-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>Province</p>
                        <p className='text-sm font-medium break-words'>
                          {data.libelleProvince}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>Ville</p>
                        <p className='text-sm font-medium break-words'>
                          {data.libelleVille}
                        </p>
                      </div>
                      <div className='sm:col-span-2 lg:col-span-1'>
                        <p className='text-xs text-muted-foreground mb-1'>Site</p>
                        <p className='text-sm font-medium break-words'>
                          {data.libelleSite}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border border-primary/30 bg-white/50'>
                  <CardHeader className='px-3 pt-3 pb-2'>
                    <CardTitle className='text-sm font-semibold text-primary'>
                      📋 Références
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='px-3 pb-3 pt-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Compte principal
                        </p>
                        <p className='text-sm font-mono break-all'>{data.fkCompte}</p>
                      </div>
                      <div>
                        <p className='text-xs text-muted-foreground mb-1'>Code receveur</p>
                        <p className='text-sm font-mono break-all'>
                          {data.codeReceveur}
                        </p>
                      </div>
                      <div className='sm:col-span-2 lg:col-span-1'>
                        <p className='text-xs text-muted-foreground mb-1'>LOGIRAD</p>
                        <p className='text-sm font-mono break-all'>
                          {data.refernceLogirad}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='border border-primary/30 bg-white/50'>
                  <CardHeader className='px-3 pt-3 pb-2'>
                    <CardTitle className='text-sm font-semibold text-primary'>
                      ⚠️ Motif de la pénalité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='px-3 pb-3 pt-2'>
                    <p className='text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 break-words'>
                      {data.motifPenalite}
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {fractions.length > 0 && (
              <Card className='border-2 border-primary/60 hover:border-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-xl bg-white/70 hover:bg-white/85 relative overflow-hidden'>
                <CardHeader className='px-4 pt-4 pb-2'>
                  <CardTitle className='text-base font-bold text-primary uppercase tracking-wide'>
                    🧩 Détail des fractions ({fractions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4 pt-2'>
                  <div className='space-y-4'>
                    {fractions.map((detail, index) => {
                      const isTypeA = detail.typeBonPayer === 1;
                      return (
                        <Card
                          key={index}
                          className='border border-primary/30 bg-white/50 hover:bg-white/70 transition-colors'
                        >
                          <CardContent className='px-3 py-3 space-y-4'>
                            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                              <h4 className='text-sm font-bold'>
                                BON À PAYER #{isTypeA ? 'A' : 'B'}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded font-medium self-start sm:self-auto ${isTypeA
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}
                              >
                                Type {isTypeA ? 'A' : 'B'} : {isTypeA ? '2/3' : '1/3'}
                              </span>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Montant
                                </p>
                                <p className='text-sm font-bold text-primary break-words'>
                                  {formatCurrency(
                                    detail.montant,
                                    data.fkDevise as 'USD' | 'CDF'
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Libellé du compte
                                </p>
                                <p className='text-sm font-medium break-words'>
                                  {detail.libelleCompte}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Compte
                                </p>
                                <p className='text-sm font-mono break-all'>
                                  {detail.fkCompte}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-muted-foreground mb-1'>
                                  Référence
                                </p>
                                <p className='text-xs font-mono text-muted-foreground break-all'>
                                  {detail.refernceBonMere}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </QueryStateWrapper>
    </div>
  );
}

export default memo(BonAPayerDetailsPage);
