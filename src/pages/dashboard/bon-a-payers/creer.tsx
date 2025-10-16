import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  users,
  provinces,
  villes,
  sites,
  comptesBancaires,
  type CompteBancaire,
} from '@/data/user';
import { type CreateBonPayerPayload } from '@/services/api';
import { ErrorDebug } from '@/components/ui/error-debug';
import { useCreateBonAPayer } from '@/hooks/useBonAPayer';
import { CompteSelectionModal } from '@/components/ui/compte-selection-modal';

const bonAPayerSchema = z.object({
  numero: z.string().min(1, 'Le numéro est requis'),
  montant: z
    .string()
    .min(1, 'Le montant est requis')
    .refine(value => /^\d+(\.\d{1,4})?$/.test(value), {
      message: 'Utilisez au maximum quatre décimales (ex: 688.5000)',
    }),
  dateEcheance: z.string().min(1, "La date d'échéance est requise"),
  motifPenalite: z.string().min(1, 'Le motif est requis'),
  refenceLogirad: z.string().min(1, 'La référence LOGIRAD est requise'),
  codeReceveur: z.string().min(1, 'Le code receveur est requis'),
  userName: z.string().min(1, "Le nom d'ordonnateur est requis"),
  fkUserCreate: z.string().min(1, "L'identifiant ordonnateur est requis"),
  fkContribuable: z.string().min(1, 'Le NIF est requis'),
  fkCompte: z.string().min(1, 'Le compte principal est requis'),
  fkCompteA: z.string().min(1, 'Le compte A est requis'),
  fkCompteB: z.string().min(1, 'Le compte B est requis'),
  fkActe: z.string().min(1, "L'acte générateur est requis"),
  fkDevise: z.enum(['USD', 'CDF'], { message: 'La devise est requise' }),
  fkNotePerception: z.string().min(1, 'La note de perception est requise'),
  fkSite: z.string().min(1, 'Le site est requis'),
  fkVille: z.string().min(1, 'La ville est requise'),
  fkProvince: z.string().min(1, 'La province est requise'),
});

type BonAPayerFormValues = z.infer<typeof bonAPayerSchema>;

const defaultValues: BonAPayerFormValues = {
  numero: '',
  montant: '',
  dateEcheance: '',
  motifPenalite: '',
  refenceLogirad: '',
  codeReceveur: '',
  userName: 'KASHALA',
  fkUserCreate: '1',
  fkContribuable: '',
  fkCompte: '',
  fkCompteA: '',
  fkCompteB: '',
  fkActe: '',
  fkDevise: 'USD',
  fkNotePerception: '',
  fkSite: '',
  fkVille: '',
  fkProvince: '',
};

function CreerBonAPayerPage() {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<string>('');

  // États pour les comptes bancaires
  const [selectedComptePrincipal, setSelectedComptePrincipal] =
    useState<CompteBancaire | null>(null);
  const [selectedCompteA, setSelectedCompteA] = useState<CompteBancaire | null>(
    null
  );
  const [selectedCompteB, setSelectedCompteB] = useState<CompteBancaire | null>(
    null
  );

  // États pour les modals
  const [isComptePrincipalModalOpen, setIsComptePrincipalModalOpen] =
    useState(false);
  const [isCompteAModalOpen, setIsCompteAModalOpen] = useState(false);
  const [isCompteBModalOpen, setIsCompteBModalOpen] = useState(false);

  const createBonAPayerMutation = useCreateBonAPayer();

  const form = useForm<BonAPayerFormValues>({
    resolver: zodResolver(bonAPayerSchema),
    defaultValues,
  });

  React.useEffect(() => {
    setSelectedProvince(defaultValues.fkProvince);
    setSelectedVille(defaultValues.fkVille);
    setSelectedSite(defaultValues.fkSite);
  }, []);

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedVille('');
    setSelectedSite('');
    form.setValue('fkProvince', provinceId);
    form.setValue('fkVille', '');
    form.setValue('fkSite', '');
  };

  const handleVilleChange = (villeId: string) => {
    setSelectedVille(villeId);
    setSelectedSite('');
    form.setValue('fkVille', villeId);
    form.setValue('fkSite', '');
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    form.setValue('fkSite', siteId);
  };

  // Fonctions de gestion des comptes bancaires
  const handleComptePrincipalSelect = (compte: CompteBancaire) => {
    setSelectedComptePrincipal(compte);
    form.setValue('fkCompte', compte.id);
    form.setValue('fkDevise', compte.devise);
  };

  const handleCompteASelect = (compte: CompteBancaire) => {
    setSelectedCompteA(compte);
    form.setValue('fkCompteA', compte.id);
  };

  const handleCompteBSelect = (compte: CompteBancaire) => {
    setSelectedCompteB(compte);
    form.setValue('fkCompteB', compte.id);
  };

  const filteredVilles = selectedProvince
    ? villes.filter(ville => ville.fkProvince === selectedProvince)
    : [];

  const filteredSites = selectedVille
    ? sites.filter(site => site.fkVille === selectedVille)
    : [];

  const onSubmit = async (values: BonAPayerFormValues) => {
    const formattedMontant = Number(values.montant).toFixed(4);
    const preparedPayload: CreateBonPayerPayload = {
      ...values,
      montant: formattedMontant,
      dateEcheance: format(new Date(values.dateEcheance), 'yyyy-MM-dd'),
    };

    createBonAPayerMutation.mutate(preparedPayload, {
      onSuccess: response => {
        if (response.code === '200') {
          toast.success('Bon à payer créé avec succès');
          navigate(`/dashboard/bon-a-payers/${response.idBonPayer}`);
        } else {
          const errorMessage = `Erreur: ${response.message}`;
          toast.error(errorMessage);
        }
      },
      onError: error => {
        console.error('Erreur lors de la création du bon à payer:', error);
        toast.error('Erreur lors de la création du bon à payer');
      },
    });
  };

  return (
    <div className=' '>
      <Card className='max-w-5xl mx-auto'>
        <CardHeader>
          <CardTitle>Enregistrer un bon à payer</CardTitle>
          <CardDescription>
            Renseignez autant de détails que possible pour préparer la requête.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {createBonAPayerMutation.error && (
            <div className='mb-6'>
              <ErrorDebug
                error={createBonAPayerMutation.error as Error}
                title='Erreur lors de la création'
              />
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <section className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary'>
                Identifiants
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='numero'>Numéro</FieldLabel>
                  <FieldContent>
                    <Input id='numero' {...form.register('numero')} />
                    <FieldError
                      errors={
                        form.formState.errors.numero && [
                          { message: form.formState.errors.numero.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor='dateEcheance'>
                    Date d'échéance
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id='dateEcheance'
                      type='date'
                      {...form.register('dateEcheance')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.dateEcheance && [
                          {
                            message: form.formState.errors.dateEcheance.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
            </section>

            <section className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary'>
                Comptes bancaires
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field className='md:col-span-2'>
                  <FieldLabel>Compte principal</FieldLabel>
                  <FieldContent>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-start h-auto p-3'
                      onClick={() => setIsComptePrincipalModalOpen(true)}
                    >
                      {selectedComptePrincipal ? (
                        <div className='flex flex-col items-start w-full text-left'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='text-sm font-medium truncate flex-1'>
                              {selectedComptePrincipal.libelle}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {selectedComptePrincipal.devise}
                            </Badge>
                          </div>
                          <span className='text-xs text-gray-500 font-mono mt-1'>
                            {selectedComptePrincipal.id}
                          </span>
                        </div>
                      ) : (
                        <span className='text-sm'>
                          Sélectionner un compte principal
                        </span>
                      )}
                    </Button>
                    <FieldError
                      errors={
                        form.formState.errors.fkCompte && [
                          { message: form.formState.errors.fkCompte.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Compte A</FieldLabel>
                  <FieldContent>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-start h-auto p-3'
                      onClick={() => setIsCompteAModalOpen(true)}
                    >
                      {selectedCompteA ? (
                        <div className='flex flex-col items-start w-full text-left'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='text-sm font-medium truncate flex-1'>
                              {selectedCompteA.libelle}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {selectedCompteA.devise}
                            </Badge>
                          </div>
                          <span className='text-xs text-gray-500 font-mono mt-1'>
                            {selectedCompteA.id}
                          </span>
                        </div>
                      ) : (
                        <span className='text-sm'>
                          Sélectionner le compte A
                        </span>
                      )}
                    </Button>
                    <FieldError
                      errors={
                        form.formState.errors.fkCompteA && [
                          { message: form.formState.errors.fkCompteA.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Compte B</FieldLabel>
                  <FieldContent>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-start h-auto p-3'
                      onClick={() => setIsCompteBModalOpen(true)}
                    >
                      {selectedCompteB ? (
                        <div className='flex flex-col items-start w-full text-left'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='text-sm font-medium truncate flex-1'>
                              {selectedCompteB.libelle}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {selectedCompteB.devise}
                            </Badge>
                          </div>
                          <span className='text-xs text-gray-500 font-mono mt-1'>
                            {selectedCompteB.id}
                          </span>
                        </div>
                      ) : (
                        <span className='text-sm'>
                          Sélectionner le compte B
                        </span>
                      )}
                    </Button>
                    <FieldError
                      errors={
                        form.formState.errors.fkCompteB && [
                          { message: form.formState.errors.fkCompteB.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
            </section>

            <section className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary'>
                Montants et actes
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='montant'>
                    Montant (4 décimales)
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id='montant'
                      {...form.register('montant')}
                      type='number'
                      step='0.0001'
                    />
                    <FieldError
                      errors={
                        form.formState.errors.montant && [
                          { message: form.formState.errors.montant.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Devise</FieldLabel>
                  <FieldContent>
                    {selectedComptePrincipal ? (
                      <div className='flex items-center gap-2 p-3 border rounded-md bg-gray-50'>
                        <Badge variant='outline'>
                          {selectedComptePrincipal.devise}
                        </Badge>
                        <span className='text-sm text-gray-600'>
                          (Figée par le compte bancaire)
                        </span>
                      </div>
                    ) : (
                      <Select
                        value={form.watch('fkDevise')}
                        onValueChange={value =>
                          form.setValue('fkDevise', value as 'USD' | 'CDF')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Sélectionner la devise' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='USD'>USD</SelectItem>
                          <SelectItem value='CDF'>CDF</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <FieldError
                      errors={
                        form.formState.errors.fkDevise && [
                          { message: form.formState.errors.fkDevise.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field className='md:col-span-2'>
                  <FieldLabel htmlFor='fkActe'>
                    Code de l'acte générateur
                  </FieldLabel>
                  <FieldContent>
                    <Input id='fkActe' {...form.register('fkActe')} />
                    <FieldError
                      errors={
                        form.formState.errors.fkActe && [
                          { message: form.formState.errors.fkActe.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field className='md:col-span-2'>
                  <FieldLabel htmlFor='motifPenalite'>
                    Motif de la pénalité
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id='motifPenalite'
                      rows={3}
                      {...form.register('motifPenalite')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.motifPenalite && [
                          {
                            message:
                              form.formState.errors.motifPenalite.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
            </section>

            <section className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary'>
                Références administratives
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='fkContribuable'>
                    NIF du contribuable
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id='fkContribuable'
                      {...form.register('fkContribuable')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.fkContribuable && [
                          {
                            message:
                              form.formState.errors.fkContribuable.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor='fkNotePerception'>
                    Note de perception
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id='fkNotePerception'
                      {...form.register('fkNotePerception')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.fkNotePerception && [
                          {
                            message:
                              form.formState.errors.fkNotePerception.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor='codeReceveur'>Code receveur</FieldLabel>
                  <FieldContent>
                    <Input
                      id='codeReceveur'
                      {...form.register('codeReceveur')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.codeReceveur && [
                          {
                            message: form.formState.errors.codeReceveur.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor='refenceLogirad'>
                    Numéro Bon à Payer Logirad
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id='refenceLogirad'
                      {...form.register('refenceLogirad')}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.refenceLogirad && [
                          {
                            message:
                              form.formState.errors.refenceLogirad.message,
                          },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
            </section>

            <section className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary'>
                Agent et localisation
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel>Ordonnateur</FieldLabel>
                  <FieldContent>
                    <Select
                      value={form.watch('userName')}
                      onValueChange={value => {
                        form.setValue('userName', value);
                        const user = users.find(u => u.username === value);
                        if (user) {
                          form.setValue('fkUserCreate', user.fkUserCreate);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionner un ordonnateur' />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem
                            key={user.fkUserCreate}
                            value={user.username}
                          >
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.userName && [
                          { message: form.formState.errors.userName.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Province</FieldLabel>
                  <FieldContent>
                    <Select
                      value={selectedProvince}
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionner une province' />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map(province => (
                          <SelectItem
                            key={province.fkProvince}
                            value={province.fkProvince}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.fkProvince && [
                          { message: form.formState.errors.fkProvince.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Ville</FieldLabel>
                  <FieldContent>
                    <Select
                      value={selectedVille}
                      onValueChange={handleVilleChange}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionner une ville' />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredVilles.map(ville => (
                          <SelectItem key={ville.fkVille} value={ville.fkVille}>
                            {ville.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.fkVille && [
                          { message: form.formState.errors.fkVille.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Site</FieldLabel>
                  <FieldContent>
                    <Select
                      value={selectedSite}
                      onValueChange={handleSiteChange}
                      disabled={!selectedVille}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionner un site' />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSites.map(site => (
                          <SelectItem key={site.fkSite} value={site.fkSite}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.fkSite && [
                          { message: form.formState.errors.fkSite.message },
                        ]
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
            </section>

            <div className='flex justify-end gap-2'>
              <Button
                type='reset'
                variant='outline'
                onClick={() => form.reset(defaultValues)}
              >
                Réinitialiser
              </Button>
              <Button
                type='submit'
                disabled={createBonAPayerMutation.isPending}
              >
                {createBonAPayerMutation.isPending
                  ? 'Fractionnement en cours...'
                  : 'Fractionner un bon à payer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modals de sélection des comptes */}
      <CompteSelectionModal
        isOpen={isComptePrincipalModalOpen}
        onClose={() => setIsComptePrincipalModalOpen(false)}
        onSelect={handleComptePrincipalSelect}
        comptes={comptesBancaires}
        title='Sélectionner le compte principal'
      />

      <CompteSelectionModal
        isOpen={isCompteAModalOpen}
        onClose={() => setIsCompteAModalOpen(false)}
        onSelect={handleCompteASelect}
        comptes={comptesBancaires}
        title='Sélectionner le compte A'
      />

      <CompteSelectionModal
        isOpen={isCompteBModalOpen}
        onClose={() => setIsCompteBModalOpen(false)}
        onSelect={handleCompteBSelect}
        comptes={comptesBancaires}
        title='Sélectionner le compte B'
      />
    </div>
  );
}

export default CreerBonAPayerPage;
