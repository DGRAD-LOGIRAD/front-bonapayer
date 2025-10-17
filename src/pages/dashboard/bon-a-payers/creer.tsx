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
import { X } from 'lucide-react';
import { users } from '@/data/user';
import {
  type CreateBonPayerPayload,
  type CompteBancaire,
} from '@/services/api';
import { ErrorDebug } from '@/components/ui/error-debug';
import { useCreateBonAPayer } from '@/hooks/useBonAPayer';
import { useComptesBancaires } from '@/hooks/useComptesBancaires';
import { useProvinces } from '@/hooks/useProvinces';
import { useVilles } from '@/hooks/useVilles';
import { useSites } from '@/hooks/useSites';
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
  fkCompteA: '',
  fkCompteB: '',
  fkActe: '',
  fkDevise: 'USD',
  fkNotePerception: '',
  fkSite: '37783', // Centre 1 par défaut
  fkVille: '',
  fkProvince: '',
};

// Valeur fixe pour le compte principal
const COMPTE_PRINCIPAL_FIXE = '00011-00101-000001291036-41';

function CreerBonAPayerPage() {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<string>('37783'); // Centre 1 par défaut

  // États pour les comptes bancaires
  const [selectedCompteA, setSelectedCompteA] = useState<CompteBancaire | null>(
    null
  );
  const [selectedCompteB, setSelectedCompteB] = useState<CompteBancaire | null>(
    null
  );
  const [selectedDevise, setSelectedDevise] = useState<string>('');

  // États pour les modals
  const [isCompteAModalOpen, setIsCompteAModalOpen] = useState(false);
  const [isCompteBModalOpen, setIsCompteBModalOpen] = useState(false);

  const createBonAPayerMutation = useCreateBonAPayer();
  const comptesBancairesQuery = useComptesBancaires();
  const provincesQuery = useProvinces();
  const villesQuery = useVilles(selectedProvince);
  const sitesQuery = useSites();

  // Filtrer les sites avec Centre 1 toujours disponible
  const getFilteredSites = () => {
    // Toujours inclure Centre 1 par défaut
    const defaultSites = [
      { id: 37783, intitule: 'Centre 1', idVille: 0 }, // Site par défaut
    ];

    let sitesList = [...defaultSites];

    // Ajouter les sites de l'API si disponibles
    if (sitesQuery.data) {
      let apiSites = sitesQuery.data;

      // Filtrer par ville si une ville est sélectionnée
      if (selectedVille) {
        apiSites = apiSites.filter(
          site => site.idVille.toString() === selectedVille
        );
      }

      // Ajouter les sites de l'API (en excluant Centre 1 s'il existe déjà)
      const filteredApiSites = apiSites.filter(
        site => !site.intitule.toLowerCase().includes('centre 1')
      );
      sitesList = [...defaultSites, ...filteredApiSites];
    }

    // Trier par nom
    return sitesList.sort((a, b) => a.intitule.localeCompare(b.intitule));
  };

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
    setSelectedSite('37783'); // Toujours Centre 1 par défaut
    form.setValue('fkProvince', provinceId);
    form.setValue('fkVille', '');
    form.setValue('fkSite', '37783');
  };

  const handleVilleChange = (villeId: string) => {
    setSelectedVille(villeId);
    setSelectedSite('37783'); // Toujours Centre 1 par défaut
    form.setValue('fkVille', villeId);
    form.setValue('fkSite', '37783');
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    form.setValue('fkSite', siteId);
  };

  // Fonction pour réinitialiser la sélection
  const resetCompteSelection = () => {
    setSelectedCompteA(null);
    setSelectedCompteB(null);
    setSelectedDevise('');
    form.setValue('fkCompteA', '');
    form.setValue('fkCompteB', '');
    form.setValue('fkDevise', 'USD'); // Valeur par défaut
  };

  // Fonctions pour désélectionner individuellement
  const handleCompteADeselect = () => {
    setSelectedCompteA(null);
    form.setValue('fkCompteA', '');

    // Si c'était le seul compte sélectionné, réinitialiser la devise
    if (!selectedCompteB) {
      setSelectedDevise('');
      form.setValue('fkDevise', 'USD');
    }
  };

  const handleCompteBDeselect = () => {
    setSelectedCompteB(null);
    form.setValue('fkCompteB', '');

    // Si c'était le seul compte sélectionné, réinitialiser la devise
    if (!selectedCompteA) {
      setSelectedDevise('');
      form.setValue('fkDevise', 'USD');
    }
  };

  // Fonctions de gestion des comptes bancaires
  const handleCompteASelect = (compte: CompteBancaire) => {
    setSelectedCompteA(compte);
    form.setValue('fkCompteA', compte.id);

    // Si c'est le premier compte sélectionné, définir la devise
    if (!selectedDevise) {
      setSelectedDevise(compte.devise);
      form.setValue('fkDevise', compte.devise as 'USD' | 'CDF');
    }

    // Si la devise change, réinitialiser l'autre compte
    if (selectedDevise && selectedDevise !== compte.devise) {
      setSelectedCompteB(null);
      form.setValue('fkCompteB', '');
    }
  };

  const handleCompteBSelect = (compte: CompteBancaire) => {
    setSelectedCompteB(compte);
    form.setValue('fkCompteB', compte.id);

    // Si c'est le premier compte sélectionné, définir la devise
    if (!selectedDevise) {
      setSelectedDevise(compte.devise);
      form.setValue('fkDevise', compte.devise as 'USD' | 'CDF');
    }

    // Si la devise change, réinitialiser l'autre compte
    if (selectedDevise && selectedDevise !== compte.devise) {
      setSelectedCompteA(null);
      form.setValue('fkCompteA', '');
    }
  };

  // Filtrer les comptes selon la devise sélectionnée
  const getFilteredComptes = () => {
    if (!comptesBancairesQuery.data) return [];

    let comptes = comptesBancairesQuery.data;

    // Si une devise est déjà sélectionnée, filtrer par cette devise
    if (selectedDevise) {
      comptes = comptes.filter(compte => compte.devise === selectedDevise);
    }

    return comptes;
  };

  const onSubmit = async (values: BonAPayerFormValues) => {
    const formattedMontant = Number(values.montant).toFixed(4);
    const preparedPayload: CreateBonPayerPayload = {
      ...values,
      fkCompte: COMPTE_PRINCIPAL_FIXE, // Valeur fixe pour le compte principal
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
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-primary'>
                  Comptes bancaires
                </h3>
                {(selectedCompteA || selectedCompteB) && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={resetCompteSelection}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <Field>
                  <FieldLabel>Compte A</FieldLabel>
                  <FieldContent>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full justify-start h-auto p-3'
                      onClick={() => {
                        if (selectedCompteA) {
                          handleCompteADeselect();
                        } else {
                          setIsCompteAModalOpen(true);
                        }
                      }}
                      disabled={comptesBancairesQuery.isLoading}
                    >
                      {selectedCompteA ? (
                        <div className='flex flex-col items-start w-full text-left'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='text-sm font-medium truncate flex-1'>
                              {selectedCompteA.intitule}
                            </span>
                            <div className='flex items-center gap-1'>
                              <Badge variant='outline' className='text-xs'>
                                {selectedCompteA.devise}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCompteADeselect();
                                }}
                                title='Désélectionner'
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          </div>
                          <div className='flex flex-col gap-1 mt-1'>
                            <span className='text-xs text-gray-500'>
                              {selectedCompteA.intituleBanque}
                            </span>
                            <span className='text-xs text-gray-500 font-mono'>
                              {selectedCompteA.id}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className='flex flex-col items-start w-full text-left'>
                          <span className='text-sm'>
                            {comptesBancairesQuery.isLoading
                              ? 'Chargement des comptes...'
                              : 'Sélectionner le compte A'}
                          </span>
                          {selectedDevise && (
                            <span className='text-xs text-gray-500 mt-1'>
                              Devise: {selectedDevise}
                            </span>
                          )}
                        </div>
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
                      onClick={() => {
                        if (selectedCompteB) {
                          handleCompteBDeselect();
                        } else {
                          setIsCompteBModalOpen(true);
                        }
                      }}
                      disabled={comptesBancairesQuery.isLoading}
                    >
                      {selectedCompteB ? (
                        <div className='flex flex-col items-start w-full text-left'>
                          <div className='flex items-center gap-2 w-full'>
                            <span className='text-sm font-medium truncate flex-1'>
                              {selectedCompteB.intitule}
                            </span>
                            <div className='flex items-center gap-1'>
                              <Badge variant='outline' className='text-xs'>
                                {selectedCompteB.devise}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCompteBDeselect();
                                }}
                                title='Désélectionner'
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          </div>
                          <div className='flex flex-col gap-1 mt-1'>
                            <span className='text-xs text-gray-500'>
                              {selectedCompteB.intituleBanque}
                            </span>
                            <span className='text-xs text-gray-500 font-mono'>
                              {selectedCompteB.id}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className='flex flex-col items-start w-full text-left'>
                          <span className='text-sm'>
                            {comptesBancairesQuery.isLoading
                              ? 'Chargement des comptes...'
                              : 'Sélectionner le compte B'}
                          </span>
                          {selectedDevise && (
                            <span className='text-xs text-gray-500 mt-1'>
                              Devise: {selectedDevise}
                            </span>
                          )}
                        </div>
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
                    {selectedDevise ? (
                      <div className='flex items-center gap-2 p-3 border rounded-md bg-gray-50'>
                        <Badge variant='outline'>{selectedDevise}</Badge>
                        <span className='text-sm text-gray-600'>
                          (Figée par le premier compte sélectionné)
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2 p-3 border rounded-md bg-gray-100'>
                        <span className='text-sm text-gray-500'>
                          Sélectionnez d'abord un compte A ou B
                        </span>
                      </div>
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
                      disabled={provincesQuery.isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            provincesQuery.isLoading
                              ? 'Chargement des provinces...'
                              : 'Sélectionner une province'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {provincesQuery.data?.map(province => (
                          <SelectItem
                            key={province.id}
                            value={province.id.toString()}
                          >
                            {province.intitule}
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
                      disabled={!selectedProvince || villesQuery.isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedProvince
                              ? "Sélectionnez d'abord une province"
                              : villesQuery.isLoading
                                ? 'Chargement des villes...'
                                : 'Sélectionner une ville'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {villesQuery.data?.map(ville => (
                          <SelectItem
                            key={ville.id}
                            value={ville.id.toString()}
                          >
                            {ville.intitule}
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionner un site' />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredSites().map(site => (
                          <SelectItem key={site.id} value={site.id.toString()}>
                            {site.intitule}
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
      {comptesBancairesQuery.data && (
        <>
          <CompteSelectionModal
            isOpen={isCompteAModalOpen}
            onClose={() => setIsCompteAModalOpen(false)}
            onSelect={handleCompteASelect}
            comptes={getFilteredComptes()}
            title='Sélectionner le compte A'
          />

          <CompteSelectionModal
            isOpen={isCompteBModalOpen}
            onClose={() => setIsCompteBModalOpen(false)}
            onSelect={handleCompteBSelect}
            comptes={getFilteredComptes()}
            title='Sélectionner le compte B'
          />
        </>
      )}

      {/* Affichage des erreurs de chargement */}
      {(comptesBancairesQuery.error ||
        provincesQuery.error ||
        villesQuery.error) && (
        <div className='fixed bottom-4 right-4 z-50 space-y-2'>
          {comptesBancairesQuery.error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg'>
              <div className='flex items-center'>
                <div className='text-red-600 text-sm'>
                  Erreur lors du chargement des comptes bancaires
                </div>
              </div>
            </div>
          )}
          {provincesQuery.error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg'>
              <div className='flex items-center'>
                <div className='text-red-600 text-sm'>
                  Erreur lors du chargement des provinces
                </div>
              </div>
            </div>
          )}
          {villesQuery.error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg'>
              <div className='flex items-center'>
                <div className='text-red-600 text-sm'>
                  Erreur lors du chargement des villes
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CreerBonAPayerPage;
