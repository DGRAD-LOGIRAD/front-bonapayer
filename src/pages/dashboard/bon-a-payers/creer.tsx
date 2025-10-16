import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
import { users, provinces, villes, sites } from '@/data/user';
import { type CreateBonPayerPayload } from '@/services/api';
import { ErrorDebug } from '@/components/ui/error-debug';
import { useCreateBonAPayer } from '@/hooks/useBonAPayer';

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
  userName: z.string().min(1, "Le nom d'utilisateur est requis"),
  fkUserCreate: z.string().min(1, "L'identifiant utilisateur est requis"),
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

type BonAPayerPayload = BonAPayerFormValues & {
  montant: string;
};

const defaultValues: BonAPayerFormValues = {
  numero: '4/DGRAD/2024',
  montant: '688.5000',
  dateEcheance: '2024-02-14',
  motifPenalite: "50% de la pénalité d'amende",
  refenceLogirad: 'BF25AA00579',
  codeReceveur: '522-800',
  userName: 'KASHALA',
  fkUserCreate: '1',
  fkContribuable: 'NIF20AC11109',
  fkCompte: '00011-00101-000001291036-41',
  fkCompteA: '0001300001003003081',
  fkCompteB: '00013000010030030810440',
  fkActe: '26403',
  fkDevise: 'USD',
  fkNotePerception: '359176',
  fkSite: '37783',
  fkVille: '19009',
  fkProvince: '2386',
};

function CreerBonAPayerPage() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<BonAPayerPayload | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<string>('');

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

    setPayload(preparedPayload as BonAPayerPayload);

    createBonAPayerMutation.mutate(preparedPayload, {
      onSuccess: response => {
        if (response.code === '200') {
          toast.success('Bon à payer créé avec succès');
          navigate(`/bon-a-payers/${response.idBonPayer}`);
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
    <div className='grid gap-6 lg:grid-cols-3'>
      <Card className='lg:col-span-2'>
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
                Montants et actes
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='montant'>
                    Montant (4 décimales)
                  </FieldLabel>
                  <FieldContent>
                    <Input id='montant' {...form.register('montant')} />
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
                Comptes bancaires
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field className='md:col-span-2'>
                  <FieldLabel htmlFor='fkCompte'>Compte principal</FieldLabel>
                  <FieldContent>
                    <Input id='fkCompte' {...form.register('fkCompte')} />
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
                  <FieldLabel htmlFor='fkCompteA'>Compte A</FieldLabel>
                  <FieldContent>
                    <Input id='fkCompteA' {...form.register('fkCompteA')} />
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
                  <FieldLabel htmlFor='fkCompteB'>Compte B</FieldLabel>
                  <FieldContent>
                    <Input id='fkCompteB' {...form.register('fkCompteB')} />
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
                    Référence LOGIRAD
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
                  <FieldLabel>Utilisateur</FieldLabel>
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
                        <SelectValue placeholder='Sélectionner un utilisateur' />
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
                  ? 'Création en cours...'
                  : 'Créer le bon à payer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className='h-fit'>
        <CardHeader>
          <CardTitle>Payload généré</CardTitle>
          <CardDescription>
            Vérifiez la structure avant l\'envoi au backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payload ? (
            <pre className='max-h-[500px] overflow-auto rounded-md bg-muted p-4 text-xs'>
              {JSON.stringify(payload, null, 2)}
            </pre>
          ) : (
            <p className='text-sm text-muted-foreground'>
              La requête apparaîtra ici après soumission.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CreerBonAPayerPage;
