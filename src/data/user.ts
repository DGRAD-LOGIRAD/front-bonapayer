// Interface pour les comptes bancaires
export interface CompteBancaire {
  id: string;
  libelle: string;
  libellebanque: string;
  devise: 'USD' | 'CDF';
}

export interface User {
  username: string;
  fkUserCreate: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface Province extends Location {
  fkProvince: string;
}

export interface Ville extends Location {
  fkVille: string;
  fkProvince: string;
}

export interface Site extends Location {
  fkSite: string;
  fkVille: string;
}

export const users: User[] = [
  {
    username: 'KASHALA',
    fkUserCreate: '1',
  },
];

export const provinces: Province[] = [
  {
    id: '2386',
    name: 'Kinshasa',
    fkProvince: '2386',
  },
];

export const villes: Ville[] = [
  {
    id: '19009',
    name: 'Kinshasa',
    fkVille: '19009',
    fkProvince: '2386',
  },
];

export const sites: Site[] = [
  {
    id: '37783',
    name: 'Centre 1',
    fkSite: '37783',
    fkVille: '19009',
  },
];

export const comptesBancaires: CompteBancaire[] = [
  {
    id: '00011-00101-000001291036-41',
    libelle: 'BAP DGRAD / USD',
    libellebanque: 'Banque Commerciale du Congo',
    devise: 'USD',
  },
  {
    id: '0001300001003003081',
    libelle: 'BAP DGRAD / CDF',
    libellebanque: 'Banque Commerciale du Congo',
    devise: 'CDF',
  },
  {
    id: '00013000010030030810440',
    libelle: 'BAP DGRAD / USD',
    libellebanque: 'Rawbank',
    devise: 'USD',
  },
  {
    id: '00014000010030030810440',
    libelle: 'Compte A CDF',
    libellebanque: 'Rawbank',
    devise: 'CDF',
  },
  {
    id: '000130000100300309810440',
    libelle: 'Compte B USD',
    libellebanque: 'Trust Merchant Bank',
    devise: 'USD',
  },
  {
    id: '00013000010030030810440',
    libelle: 'Compte B CDF',
    libellebanque: 'Trust Merchant Bank',
    devise: 'CDF',
  },
];
