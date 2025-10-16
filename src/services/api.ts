import axios, { AxiosError, type AxiosResponse } from 'axios';

const getApiBaseUrl = () => {
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  config => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
      environment: import.meta.env.MODE,
      protocol: window.location.protocol,
    });
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Gestion spécifique des erreurs CORS
    if (error.message.includes('CORS') || error.message.includes('cors')) {
      console.error(
        '🚫 Erreur CORS détectée. Vérifiez la configuration du serveur.'
      );
    }

    return Promise.reject(error);
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

export const apiService = {
  async createBonPayer(
    payload: CreateBonPayerPayload
  ): Promise<CreateBonPayerResponse> {
    try {
      const response = await apiClient.post<CreateBonPayerResponse>(
        '/fractionnerBonPayer',
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
        '/loadBonPayer',
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
};
