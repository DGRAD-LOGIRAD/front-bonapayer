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
