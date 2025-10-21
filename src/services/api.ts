import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { BonAPayerSummary } from '@/components/dashboard/datatable';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

const registresClient = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError = {
      status: error.response?.status || 500,
      message:
        (error.response?.data as { message?: string })?.message ||
        error.message,
      code: error.code,
    };

    return Promise.reject(apiError);
  }
);

registresClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

registresClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError = {
      status: error.response?.status || 500,
      message:
        (error.response?.data as { message?: string })?.message ||
        error.message,
      code: error.code,
    };

    return Promise.reject(apiError);
  }
);

export interface CreateBonPayerResponse {
  référenceBonPayer: string;
  code: string;
  idBonPayer: number;
  message: string;
}

export interface BonPayerDetail {
  nomContribuable: string;
  numero: string;
  libelleCompte: string;
  fkProvince: number;
  libelleProvince: string;
  montant: number;
  libelleSite: string;
  dateCreate: string;
  fkContribuable: string;
  codeReceveur: string;
  id: number;
  motifPenalite: string;
  libelleActe: string;
  libelleDevise: string;
  nomUtilisateur: string;
  fkActe: number;
  fkDevise: string;
  fkUserCreate: number;
  libelleVille: string;
  fkNotePerception: number;
  fkVille: number;
  fkCompte: string;
  fkSite: number;
  dateEcheance: string;
  refernceBnp: string;
  refernceBonMere?: string;
  fkBonPayerMere?: number;
  typeBonPayer?: number;
}

export interface BonPayerDetailsResponse {
  data: {
    nomContribuable: string;
    numero: string;
    libelleCompte: string;
    fkProvince: number;
    libelleProvince: string;
    montant: number;
    libelleSite: string;
    dateCreate: string;
    fkContribuable: string;
    codeReceveur: string;
    id: number;
    detailsBonPayerList: BonPayerDetail[];
    motifPenalite: string;
    libelleActe: string;
    libelleDevise: string;
    nomUtilisateur: string;
    fkActe: number;
    fkDevise: string;
    fkUserCreate: number;
    libelleVille: string;
    fkNotePerception: number;
    fkVille: number;
    fkCompte: string;
    refernceLogirad: string;
    fkSite: number;
    dateEcheance: string;
    refernceBnp: string;
  };
  message: string;
  status: string;
}

export interface CompteBancaire {
  idBanque: number;
  id: string;
  intituleBanque: string;
  etat: number;
  intitule: string;
  devise: string;
}

export interface ComptesBancairesResponse {
  data: CompteBancaire[];
  message: string;
  status: string;
}

export interface Province {
  id: number;
  etat: number;
  intitule: string;
}

export interface ProvincesResponse {
  data: Province[];
  message: string;
  status: string;
}

export interface Ville {
  id: number;
  etat: number;
  intitule: string;
  idProvince: number;
}

export interface VillesResponse {
  data: Ville[];
  message: string;
  status: string;
}

export interface Site {
  id: number;
  etat: number;
  intitule: string;
  idVille: number;
}

export interface SitesResponse {
  data: Site[];
  message: string;
  status: string;
}

export interface CreateBonPayerPayload {
  numero: string;
  montant: string;
  dateEcheance: string;
  motifPenalite: string;
  refenceLogirad: string;
  codeReceveur: string;
  userName: string;
  fkUserCreate: string;
  fkContribuable: string;
  fkCompte: string;
  fkCompteA: string;
  fkCompteB: string;
  fkActe: string;
  fkDevise: string;
  fkNotePerception: string;
  fkSite: string;
  fkVille: string;
  fkProvince: string;
}

export interface BonPayerSearchData {
  numero: string;
  fkActe: string;
  fkDevise: string;
  montant: number;
  fkUserCreate: number;
  dateCreate: string;
  motif_penalite: string;
  etat: number;
  fkNotePerception: string;
  fkCompte: string;
  fkSite: string;
  estFractionner: number;
  dateEcheance: string;
  id: string;
}

export interface BonPayerSearchResponse {
  data: BonPayerSearchData;
  message: string;
  status: string;
}

export interface BonAPayerRegistre {
  id: number;
  numero: string;
  nomContribuable: string;
  nif: string;
  montant: number;
  devise: string;
  etat: number;
  createdAt: string;
  idActe: number;
  intituleActe: string;
  idSite: number;
  intituleSite: string;
  motifPenalite: string;
  nomProvince: string;
  nomVille: string;
  referenceLogirad: string;
}

export interface BonAPayerRegistresResponse {
  code: number;
  data: BonAPayerRegistre[];
  metaData: {
    page: number;
    pagination: number;
    total: number;
  };
}

export const apiService = {
  async createBonPayer(
    payload: CreateBonPayerPayload
  ): Promise<CreateBonPayerResponse> {
    try {
      const response = await apiClient.post<CreateBonPayerResponse>(
        '/ms_bp/fractionnerBonPayer',
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<CreateBonPayerResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors de la création du bon à payer');
    }
  },

  async getBonPayerDetails(
    idBonPayer: number
  ): Promise<BonPayerDetailsResponse> {
    try {
      const response = await apiClient.post<BonPayerDetailsResponse>(
        '/ms_bp/loadBonPayer',
        {
          idBonPayer: `${idBonPayer}`,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<BonPayerDetailsResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des détails');
    }
  },

  async getComptesBancaires(): Promise<ComptesBancairesResponse> {
    try {
      const response = await apiClient.get<ComptesBancairesResponse>(
        '/ms_bp/getCompteBancaire'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ComptesBancairesResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error(
        'Erreur inconnue lors du chargement des comptes bancaires'
      );
    }
  },

  async getProvinces(): Promise<ProvincesResponse> {
    try {
      const response =
        await apiClient.get<ProvincesResponse>('/ms_bp/getProvince');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ProvincesResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des provinces');
    }
  },

  async getVilles(idProvince: string): Promise<VillesResponse> {
    try {
      const response = await apiClient.post<VillesResponse>('/ms_bp/getVille', {
        idProvince: idProvince,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<VillesResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des villes');
    }
  },

  async getSites(idVille: string): Promise<SitesResponse> {
    try {
      const response = await apiClient.post<SitesResponse>(
        '/ms_bp/getSiteByVille',
        {
          idVille: idVille,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<SitesResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des sites');
    }
  },

  async getBonPayerByCode(
    codeBonPayer: string
  ): Promise<BonPayerSearchResponse> {
    try {
      const response = await apiClient.post<BonPayerSearchResponse>(
        '/ms_bp/getBonPayerOrdByCode',
        {
          codeBonPayer: codeBonPayer,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<BonPayerSearchResponse>;
        if (axiosError.response) {
          if (axiosError.response.status === 404) {
            throw new Error('404 - Bon à payer non trouvé');
          }
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors de la recherche du bon à payer');
    }
  },
  async getBonAPayerRegistres(
    pagination: { pageSize: number; page: number },
    filters: {
      contribuableNif?: string;
      contribuableName?: string;
      reference_bon_a_payer_logirad?: string;
    }
  ): Promise<BonAPayerSummary[]> {
    try {
      const response = await registresClient.post<BonAPayerRegistresResponse>(
        '/ms-bp/reg/api/v1/bon-a-payer',
        {
          pagination,
          filters: {
            contribuableNif: filters.contribuableNif || '*',
            contribuableName: filters.contribuableName || '*',
            reference_bon_a_payer_logirad:
              filters.reference_bon_a_payer_logirad || '*',
          },
        }
      );
      return (
        response?.data?.data?.map(
          (item: BonAPayerRegistre): BonAPayerSummary => {
            return {
              id: item.id,
              numero: item.referenceLogirad || '',
              motif: item.motifPenalite || '',
              montant: Number(item.montant) || 0,
              devise: item.devise || 'CDF',
              createdAt: item.createdAt || '',
              etat: item.etat || 1,
              assujetti: {
                nom_ou_raison_sociale: item.nomContribuable || '',
                NIF: item.nif || '',
              },
              centre: {
                nom: item.intituleSite || '',
                ville: {
                  nom: item.nomVille || '',
                  province: {
                    nom: item.nomProvince || '',
                  },
                },
              },
            };
          }
        ) || []
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<BonAPayerRegistresResponse>;
        if (axiosError.response) {
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.message}`
          );
        } else if (axiosError.request) {
          throw new Error(
            `Erreur réseau: Impossible de joindre le serveur ${API_BASE_URL}. Vérifiez votre connexion et que le serveur est accessible.`
          );
        } else {
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des registres');
    }
  },
};
