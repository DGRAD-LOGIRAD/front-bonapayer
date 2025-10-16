import type { BonAPayerSummary } from '@/components/dashboard/datatable';
import type { DashboardStats } from '@/components/dashboard/indicateurs';

export const dashboardStats: DashboardStats = {
  bonAPayerNonFractionne: 12,
  bonAPayeFractionne: 8,
  totalUSD: 1_250_000.4567,
  totalCDF: 985_000_000.1234,
};

export const bonAPayers: BonAPayerSummary[] = [
  {
    id: 1,
    documentId: 'BNP000000000000000000012025KASWIL',
    numero: '4/DGRAD/2024',
    motif: '50% de la pénalité d’amende',
    montant: 688.5,
    devise: 'USD',
    createdAt: '2024-02-14',
    assujetti: {
      nom_ou_raison_sociale: 'CONGO DONGFANG INTERNATIONAL MINING CDM',
      NIF: 'NIF20AC11109',
    },
    centre: {
      nom: 'DIRDOM',
      ville: {
        nom: 'Kinshasa',
        province: {
          nom: 'Kinshasa',
        },
      },
    },
  },
  {
    id: 2,
    documentId: 'BNP000000000000000000022025KASWIL',
    numero: '5/DGRAD/2024',
    motif: 'Paiement des droits de douane',
    montant: 1025.97,
    devise: 'USD',
    createdAt: '2024-03-02',
    assujetti: {
      nom_ou_raison_sociale: 'MINES CONGO SARL',
      NIF: 'NIF24BC44321',
    },
    centre: {
      nom: 'GOMA',
      ville: {
        nom: 'Goma',
        province: {
          nom: 'Nord-Kivu',
        },
      },
    },
  },
  {
    id: 3,
    documentId: 'BNP000000000000000000032025KASWIL',
    numero: '6/DGRAD/2024',
    motif: 'Redevance administrative annuelle',
    montant: 9_543_250,
    devise: 'CDF',
    createdAt: '2024-01-28',
    assujetti: {
      nom_ou_raison_sociale: 'BUREAU NATIONAL DES TRANSPORTS',
      NIF: 'NIF10BG09872',
    },
    centre: {
      nom: 'MATADI',
      ville: {
        nom: 'Matadi',
        province: {
          nom: 'Kongo-Central',
        },
      },
    },
  },
  {
    id: 4,
    documentId: 'BNP000000000000000000042025KASWIL',
    numero: '7/DGRAD/2024',
    motif: 'Taxe sur les produits pétroliers',
    montant: 3250.55,
    devise: 'USD',
    createdAt: '2024-04-10',
    assujetti: {
      nom_ou_raison_sociale: 'PETRO CONGO SA',
      NIF: 'NIF11BD77431',
    },
    centre: {
      nom: 'LUBUMBASHI',
      ville: {
        nom: 'Lubumbashi',
        province: {
          nom: 'Haut-Katanga',
        },
      },
    },
  },
];
