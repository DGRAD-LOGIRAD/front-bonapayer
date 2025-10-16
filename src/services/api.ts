import axios, { AxiosError, type AxiosResponse } from 'axios';

const API_BASE_URL = '/api';

// Configuration d'Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  config => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
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
          // Le serveur a répondu avec un code d'erreur
          throw new Error(
            `Erreur serveur: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.message}`
          );
        } else if (axiosError.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          throw new Error(
            'Aucune réponse du serveur. Vérifiez votre connexion.'
          );
        } else {
          // Quelque chose s'est mal passé lors de la configuration de la requête
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
          // La requête a été faite mais aucune réponse n'a été reçue
          throw new Error(
            'Aucune réponse du serveur. Vérifiez votre connexion.'
          );
        } else {
          // Quelque chose s'est mal passé lors de la configuration de la requête
          throw new Error(`Erreur de configuration: ${axiosError.message}`);
        }
      }
      throw new Error('Erreur inconnue lors du chargement des détails');
    }
  },
};
