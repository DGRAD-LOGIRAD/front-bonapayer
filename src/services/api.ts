import axios, { AxiosError } from 'axios';

// Configuration pour utiliser le proxy
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

  async getSites(): Promise<SitesResponse> {
    try {
      const response = await apiClient.get<SitesResponse>('/ms_bp/getSite');
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
  async getBonAPayerRegistres(
    pagination: { pageSize: number; page: number },
    filters: {
      contribuableNif?: string;
      contribuableName?: string;
      reference_bon_a_payer_logirad?: string;
    }
  ): Promise<BonAPayerRegistresResponse> {
    try {
      const response = await apiClient.post<BonAPayerRegistresResponse>(
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
      return response.data;
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
