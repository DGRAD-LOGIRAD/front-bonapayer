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
import { X, Search, RefreshCw } from 'lucide-react';
import { users } from '@/data/user';
import {
  type CreateBonPayerPayload,
  type CompteBancaire,
  type BonPayerSearchData,
} from '@/services/api';
import { ErrorDebug } from '@/components/ui/error-debug';
import { useCreateBonAPayer, useSearchBonAPayer } from '@/hooks/useBonAPayer';
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
  fkSite: '37783',
  fkVille: '',
  fkProvince: '',
};


const COMPTE_PRINCIPAL_FIXE = '00011-00101-000001291036-41';

function CreeBonAPayerPage() {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<string>('37783');


  const [selectedCompteA, setSelectedCompteA] = useState<CompteBancaire | null>(
    null
  );
  const [selectedCompteB, setSelectedCompteB] = useState<CompteBancaire | null>(
    null
  );
  const [selectedDevise, setSelectedDevise] = useState<string>('');


  const [isCompteAModalOpen, setIsCompteAModalOpen] = useState(false);
  const [isCompteBModalOpen, setIsCompteBModalOpen] = useState(false);

  const [searchCode, setSearchCode] = useState<string>('');
  const [foundBonPayer, setFoundBonPayer] = useState<BonPayerSearchData | null>(null);
  const [isFormPrefilled, setIsFormPrefilled] = useState<boolean>(false);

  const createBonAPayerMutation = useCreateBonAPayer();
  const searchBonAPayerMutation = useSearchBonAPayer();
  const comptesBancairesQuery = useComptesBancaires();
  const provincesQuery = useProvinces();
  const villesQuery = useVilles(selectedProvince);
  const sitesQuery = useSites(selectedVille.toString());


  const getFilteredSites = () => {



    if (!sitesQuery.data || sitesQuery.data.length === 0) {
      return [];
    }


    let apiSites = sitesQuery.data;


    const filteredApiSites = apiSites.filter(
      site => !site.intitule.toLowerCase().includes('centre 1')
    );


    const allSites = [...filteredApiSites];


    return allSites.sort((a, b) => a.intitule.localeCompare(b.intitule));
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


  React.useEffect(() => {
    if (sitesQuery.data && selectedSite) {
      const availableSites = getFilteredSites();
      const isCurrentSiteValid = availableSites.some(site => site.id.toString() === selectedSite);

      if (!isCurrentSiteValid) {

        setSelectedSite('37783');
        form.setValue('fkSite', '37783');
      }
    }
  }, [sitesQuery.data, selectedVille, selectedSite, form]);

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedVille('');

    form.setValue('fkProvince', provinceId);
    form.setValue('fkVille', '');
  };

  const handleVilleChange = (villeId: string) => {
    setSelectedVille(villeId);
    form.setValue('fkVille', villeId);
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    form.setValue('fkSite', siteId);
  };

  const resetCompteSelection = () => {
    setSelectedCompteA(null);
    setSelectedCompteB(null);
    setSelectedDevise('');
    form.setValue('fkCompteA', '');
    form.setValue('fkCompteB', '');
    form.setValue('fkDevise', 'USD');
  };

  const handleCompteADeselect = () => {
    setSelectedCompteA(null);
    form.setValue('fkCompteA', '');

    if (!selectedCompteB) {
      setSelectedDevise('');
      form.setValue('fkDevise', 'USD');
    }
  };

  const handleCompteBDeselect = () => {
    setSelectedCompteB(null);
    form.setValue('fkCompteB', '');

    if (!selectedCompteA) {
      setSelectedDevise('');
      form.setValue('fkDevise', 'USD');
    }
  };

  const handleCompteASelect = (compte: CompteBancaire) => {
    setSelectedCompteA(compte);
    form.setValue('fkCompteA', compte.id);

    if (!selectedDevise) {
      setSelectedDevise(compte.devise);
      form.setValue('fkDevise', compte.devise as 'USD' | 'CDF');
    }

    if (selectedDevise && selectedDevise !== compte.devise) {
      setSelectedCompteB(null);
      form.setValue('fkCompteB', '');
    }
  };

  const handleCompteBSelect = (compte: CompteBancaire) => {
    setSelectedCompteB(compte);
    form.setValue('fkCompteB', compte.id);

    if (!selectedDevise) {
      setSelectedDevise(compte.devise);
      form.setValue('fkDevise', compte.devise as 'USD' | 'CDF');
    }

    if (selectedDevise && selectedDevise !== compte.devise) {
      setSelectedCompteA(null);
      form.setValue('fkCompteA', '');
    }
  };

  const getFilteredComptes = () => {
    if (!comptesBancairesQuery.data) return [];

    let comptes = comptesBancairesQuery.data;

    if (selectedDevise) {
      comptes = comptes.filter(compte => compte.devise === selectedDevise);
    }

    return comptes;
  };

  const handleSearch = () => {
    if (!searchCode.trim()) {
      toast.error('Veuillez saisir un code de bon à payer');
      return;
    }

    searchBonAPayerMutation.mutate(searchCode.trim(), {
      onSuccess: response => {
        if (response.status === '200' && response.data) {
          setFoundBonPayer(response.data);
          prefillFormWithSearchData(response.data);
          toast.success('Bon à payer trouvé et formulaire pré-rempli');
        } else {
          toast.error('Il n\'existe pas de bon à payer pour ce numéro');
        }
      },
      onError: error => {
        if (error.message && error.message.includes('404')) {
          toast.error('Il n\'existe pas de bon à payer pour ce numéro');
        } else if (error.message && error.message.includes('non trouvé')) {
          toast.error('Il n\'existe pas de bon à payer pour ce numéro');
        } else {
          toast.error('Erreur lors de la recherche du bon à payer');
        }
      },
    });
  };

  const handleResetSearch = () => {
    setSearchCode('');
    setFoundBonPayer(null);
    setIsFormPrefilled(false);
    form.reset(defaultValues);
    resetCompteSelection();
    setSelectedProvince('');
    setSelectedVille('');
    setSelectedSite('37783');
  };

  const prefillFormWithSearchData = (data: BonPayerSearchData) => {
    const convertDateFormat = (dateString: string): string => {
      try {
        const [datePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } catch (error) {
        return '';
      }
    };

    const parsedData = {
      numero: data.numero || '',
      montant: data.montant ? data.montant.toString() : '',
      dateEcheance: data.dateEcheance ? convertDateFormat(data.dateEcheance) : '',
      motifPenalite: data.motif_penalite || '',
      refenceLogirad: data.id || '',
      fkActe: data.fkActe.toString() || '',
      fkDevise: data.fkDevise.toString() as 'USD' | 'CDF',
      fkNotePerception: data.fkNotePerception.toString() || '',
      fkCompte: data.fkCompte.toString() || '',
    };

    Object.entries(parsedData).forEach(([key, value]) => {
      if (value) {
        form.setValue(key as keyof BonAPayerFormValues, value);
      }
    });

    if (parsedData.fkDevise) {
      setSelectedDevise(parsedData.fkDevise);
    }

    setIsFormPrefilled(true);
  };

  const onSubmit = async (values: BonAPayerFormValues) => {
    const formattedMontant = Number(values.montant).toFixed(4);
    const preparedPayload: CreateBonPayerPayload = {
      ...values,
      fkCompte: COMPTE_PRINCIPAL_FIXE,
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
        toast.error('Erreur lors de la création du bon à payer');
      },
    });
  };

  return (
    <div className=' '>
      <Card className='max-w-5xl mx-auto'>
        <CardHeader>
          <CardTitle>Fractionner un bon à payer</CardTitle>
          <CardDescription>
            Renseignez le code du bon à payer pour le fractionner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className='space-y-4 mb-8'>
            <h3 className='text-lg font-semibold text-primary'>
              Rechercher un bon à payer
            </h3>
            <div className='flex gap-4 items-end'>
              <Field className='flex-1'>
                <FieldLabel htmlFor='searchCode'>
                  Code du bon à payer
                </FieldLabel>
                <FieldContent>
                  <Input
                    id='searchCode'
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder='Ex: BF25AA00581'
                    disabled={searchBonAPayerMutation.isPending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                </FieldContent>
              </Field>
              <Button
                type='button'
                onClick={handleSearch}
                disabled={searchBonAPayerMutation.isPending || !searchCode.trim()}
                className='mb-0'
              >
                {searchBonAPayerMutation.isPending ? (
                  <RefreshCw className='h-4 w-4 animate-spin mr-2' />
                ) : (
                  <Search className='h-4 w-4 mr-2' />
                )}
                {searchBonAPayerMutation.isPending ? 'Recherche...' : 'Rechercher'}
              </Button>
              {foundBonPayer && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleResetSearch}
                  className='mb-0'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Réinitialiser
                </Button>
              )}
            </div>

            {foundBonPayer && (
              <Card className='bg-green-50 border-green-200'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-green-800 text-base'>
                    Bon à payer trouvé
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='grid gap-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Numéro:</span>
                      <span>{foundBonPayer.numero}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Montant:</span>
                      <span>{foundBonPayer.montant.toLocaleString()} {foundBonPayer.fkDevise}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Date d'échéance:</span>
                      <span>{foundBonPayer.dateEcheance.split(' ')[0]}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium'>Motif:</span>
                      <span className='text-right max-w-xs truncate'>{foundBonPayer.motif_penalite}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {searchBonAPayerMutation.error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='text-red-600 text-sm'>
                  {searchBonAPayerMutation.error.message}
                </div>
              </div>
            )}
          </section>

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
                    <Input
                      id='numero'
                      {...form.register('numero')}
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
                    />
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
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
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
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
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
                      <div className={`flex items-center gap-2 p-3 border rounded-md ${isFormPrefilled ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        <Badge variant='outline'>{selectedDevise}</Badge>
                        <span className='text-sm text-gray-600'>
                          {isFormPrefilled ? '(Pré-rempli par la recherche)' : '(Figée par le premier compte sélectionné)'}
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
                    <Input
                      id='fkActe'
                      {...form.register('fkActe')}
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
                    />
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
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
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
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
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
                      disabled={isFormPrefilled}
                      className={isFormPrefilled ? 'bg-gray-50' : ''}
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
                disabled={createBonAPayerMutation.isPending || !foundBonPayer}
              >
                {createBonAPayerMutation.isPending
                  ? 'Fractionnement en cours...'
                  : foundBonPayer
                    ? `Fractionner le bon ${foundBonPayer.id}`
                    : 'Recherchez d\'abord un bon à payer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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

export default CreeBonAPayerPage;
