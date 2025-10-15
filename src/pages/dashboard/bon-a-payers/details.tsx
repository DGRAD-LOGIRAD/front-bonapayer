import {
  Calendar,
  DollarSign,
  FileText,
  Hash,
  MapPin,
  Printer,
  User,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { findBonAPayerDetail } from '@/data/bon-a-payer-details';
import { formatCurrency } from '@/lib/utils';

function BonAPayerDetailsPage() {
  const { documentId } = useParams();
  const detail = documentId ? findBonAPayerDetail(documentId) : null;

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bon à payer introuvable</CardTitle>
          <CardDescription>
            Aucun bon à payer ne correspond à la référence demandée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant='outline'>
            <Link to='/dashboard/bon-a-payers'>Retourner à la liste</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currency: 'USD' | 'CDF' = detail.fkDevise === 'CDF' ? 'CDF' : 'USD';

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Détails du bon à payer
          </h1>
          <p className='text-muted-foreground'>
            Référence LOGIRAD {detail.refenceLogirad} — BNP {detail.refernceBnp}
          </p>
        </div>
        <Button>
          <Printer className='mr-2 h-4 w-4' />
          Imprimer le bon à payer
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-primary'>
                <User className='h-5 w-5' />
                Contribuable
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <DetailItem
                label='Nom ou raison sociale'
                value={detail.nomContribuable}
              />
              <DetailItem label='NIF' value={detail.fkContribuable} />
              <DetailItem
                label='Province'
                value={`${detail.libelleProvince} (${detail.fkProvince})`}
              />
              <DetailItem
                label='Ville'
                value={`${detail.libelleVille} (${detail.fkVille})`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-primary'>
                <FileText className='h-5 w-5' />
                Informations du bon
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <DetailItem label='Numéro' value={detail.numero} icon={Hash} />
              <DetailItem
                label='Montant'
                value={formatCurrency(detail.montant, currency)}
                icon={DollarSign}
              />
              <DetailItem
                label='Motif / pénalité'
                value={detail.motifPenalite}
                className='md:col-span-2'
              />
              <DetailItem
                label='Compte principal'
                value={detail.libelleCompte}
                className='md:col-span-2'
              />
              <DetailItem
                label='Compte (FK)'
                value={detail.fkCompte}
                className='md:col-span-2 font-mono text-sm'
              />
              <DetailItem
                label='Acte générateur'
                value={`${detail.libelleActe} (${detail.fkActe})`}
              />
              <DetailItem
                label='Devise'
                value={`${detail.libelleDevise} (${detail.fkDevise})`}
              />
              <DetailItem
                label='Note de perception'
                value={String(detail.fkNotePerception)}
              />
              <DetailItem
                label='Date d’exigibilité'
                value={detail.dateEcheance || 'Non renseignée'}
                icon={Calendar}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-primary'>
                <MapPin className='h-5 w-5' />
                Site d’ordonnancement
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
              <DetailItem label='Site' value={detail.libelleSite} />
              <DetailItem label='Code receveur' value={detail.codeReceveur} />
              <DetailItem
                label='Date de création'
                value={detail.dateCreate}
                icon={Calendar}
              />
              <DetailItem
                label='Agent ordonnateur'
                value={detail.nomUtilisateur}
                icon={User}
              />
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Fractionnements</CardTitle>
              <CardDescription>
                Bons dérivés du bon principal {detail.numero}.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {detail.detailsBonPayerList.map(fraction => (
                <div
                  key={fraction.id}
                  className='rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm font-semibold'>
                        BNP {fraction.refernceBnp}
                      </p>
                      <p className='text-xs uppercase text-muted-foreground'>
                        Type {fraction.typeBonPayer}
                      </p>
                    </div>
                    <Button variant='outline' size='sm'>
                      <Printer className='mr-2 h-4 w-4' />
                      Imprimer
                    </Button>
                  </div>
                  <Separator />
                  <div className='grid gap-3 text-sm'>
                    <DetailRow
                      label='Montant'
                      value={formatCurrency(
                        fraction.montant,
                        fraction.fkDevise === 'CDF' ? 'CDF' : 'USD'
                      )}
                    />
                    <DetailRow
                      label='Compte'
                      value={fraction.fkCompte}
                      isMono
                    />
                    <DetailRow
                      label='Site'
                      value={`${fraction.libelleSite} (${fraction.libelleVille})`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé rapide</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <DetailRow label='Numéro' value={detail.numero} />
              <DetailRow
                label='Montant'
                value={formatCurrency(detail.montant, currency)}
              />
              <DetailRow label='Devise' value={detail.fkDevise} />
              <DetailRow label='Créer par' value={detail.nomUtilisateur} />
              <DetailRow
                label='Utilisateur (FK)'
                value={String(detail.fkUserCreate)}
              />
              <DetailRow label='Compte A' value='0001300001003003081' isMono />
              <DetailRow
                label='Compte B'
                value='00013000010030030810440'
                isMono
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  className,
  icon: Icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: typeof Hash;
}) {
  return (
    <div className={className}>
      <p className='text-xs uppercase text-muted-foreground flex items-center gap-2'>
        {Icon ? <Icon className='h-3.5 w-3.5 text-primary' /> : null}
        {label}
      </p>
      <p className='text-sm font-semibold text-foreground'>{value}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  isMono = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <span className='text-muted-foreground'>{label}</span>
      <span className={isMono ? 'font-mono text-xs' : 'font-semibold'}>
        {value}
      </span>
    </div>
  );
}

export default BonAPayerDetailsPage;
