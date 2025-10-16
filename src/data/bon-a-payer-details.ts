export interface BonAPayerDetail {
  id: number;
  numero: string;
  nomContribuable: string;
  libelleCompte: string;
  fkProvince: number;
  libelleProvince: string;
  montant: number;
  libelleSite: string;
  dateCreate: string;
  fkContribuable: string;
  codeReceveur: string;
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
  refenceLogirad: string;
  fkSite: number;
  dateEcheance: string;
  refernceBnp: string;
  detailsBonPayerList: Array<{
    nomContribuable: string;
    numero: string;
    libelleCompte: string;
    fkProvince: number;
    libelleProvince: string;
    montant: number;
    typeBonPayer: number;
    libelleSite: string;
    dateCreate: string;
    refernceBonMere: string;
    fkContribuable: string;
    fkBonPayerMere: number;
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
  }>;
}

const bonAPayerDetail: BonAPayerDetail = {
  id: 1,
  numero: '4/DGRAD/2024',
  nomContribuable: 'CONGO DONGFANG INTERNATIONAL MINING CDM ',
  libelleCompte: 'EQUITYBCDC - ADMINISTRATION CENTRALE / USD',
  fkProvince: 2386,
  libelleProvince: 'Kinshasa',
  montant: 688.5,
  libelleSite: 'DIRDOM',
  dateCreate: '15/10/2025 14:19:25',
  fkContribuable: 'NIF20AC11109',
  codeReceveur: '522-800',
  motifPenalite: "50% de la pénalité d'amende",
  libelleActe: 'AMENDES TRANSACTIONNELLES  ADMINISTRATIVES',
  libelleDevise: 'DOLLARS',
  nomUtilisateur: 'KASHALA KABANGU Willy',
  fkActe: 26403,
  fkDevise: 'USD',
  fkUserCreate: 1,
  libelleVille: 'Kinshasa',
  fkNotePerception: 359176,
  fkVille: 19009,
  fkCompte: '00011-00101-000001291036-41',
  refenceLogirad: 'BF25AA00579',
  fkSite: 37783,
  dateEcheance: '14/02/2024 00:00:00',
  refernceBnp: 'BNP000000000000000000012025KASWIL',
  detailsBonPayerList: [
    {
      nomContribuable: 'CONGO DONGFANG INTERNATIONAL MINING CDM ',
      numero: '4/DGRAD/2024',
      libelleCompte: 'BAP DGRAD / USD',
      fkProvince: 2386,
      libelleProvince: 'Kinshasa',
      montant: 229.4771,
      typeBonPayer: 1,
      libelleSite: 'DIRDOM',
      dateCreate: '15/10/2025 14:19:25',
      refernceBonMere: 'BF25AA00579',
      fkContribuable: 'NIF20AC11109',
      fkBonPayerMere: 1,
      codeReceveur: '522-800',
      id: 1,
      motifPenalite: "50% de la pénalité d'amende",
      libelleActe: 'AMENDES TRANSACTIONNELLES  ADMINISTRATIVES',
      libelleDevise: 'DOLLARS',
      nomUtilisateur: 'KASHALA KABANGU Willy',
      fkActe: 26403,
      fkDevise: 'USD',
      fkUserCreate: 1,
      libelleVille: 'Kinshasa',
      fkNotePerception: 359176,
      fkVille: 19009,
      fkCompte: '0001300001003003081',
      fkSite: 37783,
      dateEcheance: '',
      refernceBnp: 'BNP000000000000000000012025KASWIL',
    },
    {
      nomContribuable: 'CONGO DONGFANG INTERNATIONAL MINING CDM ',
      numero: '4/DGRAD/2024',
      libelleCompte: 'BAP DGRAD/USD',
      fkProvince: 2386,
      libelleProvince: 'Kinshasa',
      montant: 459.023,
      typeBonPayer: 2,
      libelleSite: 'DIRDOM',
      dateCreate: '15/10/2025 14:19:25',
      refernceBonMere: 'BF25AA00579',
      fkContribuable: 'NIF20AC11109',
      fkBonPayerMere: 1,
      codeReceveur: '522-800',
      id: 2,
      motifPenalite: "50% de la pénalité d'amende",
      libelleActe: 'AMENDES TRANSACTIONNELLES  ADMINISTRATIVES',
      libelleDevise: 'DOLLARS',
      nomUtilisateur: 'KASHALA KABANGU Willy',
      fkActe: 26403,
      fkDevise: 'USD',
      fkUserCreate: 1,
      libelleVille: 'Kinshasa',
      fkNotePerception: 359176,
      fkVille: 19009,
      fkCompte: '00013000010030030810440',
      fkSite: 37783,
      dateEcheance: '',
      refernceBnp: 'BNP000000000000000000022025KASWIL',
    },
  ],
};

export function findBonAPayerDetail(documentId: string) {
  if (documentId === bonAPayerDetail.refernceBnp) {
    return bonAPayerDetail;
  }

  return null;
}
