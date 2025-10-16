import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock pour fractionnerBonPayer
  http.post('/api/fractionnerBonPayer', async ({ request }) => {
    const body = await request.json();
    console.log('🎭 MSW - fractionnerBonPayer called with:', body);

    // Simuler une réponse de succès
    return HttpResponse.json(
      {
        référenceBonPayer: 'BNP000000000000000000012025KASWIL',
        code: '200',
        idBonPayer: 1,
        message: 'Fractionnement du bon à payer effectué avec succès.',
      },
      { status: 200 }
    );
  }),

  // Mock pour loadBonPayer
  http.post('/api/loadBonPayer', async ({ request }) => {
    const body = await request.json();
    const { idBonPayer } = body as { idBonPayer: string };
    console.log('🎭 MSW - loadBonPayer called with ID:', idBonPayer);

    if (idBonPayer === '1') {
      return HttpResponse.json({
        data: {
          nomContribuable: 'CONGO DONGFANG INTERNATIONAL MINING CDM',
          numero: '4/DGRAD/2024',
          libelleCompte: 'EQUITYBCDC - ADMINISTRATION CENTRALE / USD',
          fkProvince: 2386,
          libelleProvince: 'Kinshasa',
          montant: 688.5,
          libelleSite: 'DIRDOM',
          dateCreate: '15/10/2025 14:19:25',
          fkContribuable: 'NIF20AC11109',
          codeReceveur: '522-800',
          id: 1,
          detailsBonPayerList: [
            {
              nomContribuable: 'CONGO DONGFANG INTERNATIONAL MINING CDM',
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
              libelleActe: 'AMENDES TRANSACTIONNELLES ADMINISTRATIVES',
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
          ],
          motifPenalite: "50% de la pénalité d'amende",
          libelleActe: 'AMENDES TRANSACTIONNELLES ADMINISTRATIVES',
          libelleDevise: 'DOLLARS',
          nomUtilisateur: 'KASHALA KABANGU Willy',
          fkActe: 26403,
          fkDevise: 'USD',
          fkUserCreate: 1,
          libelleVille: 'Kinshasa',
          fkNotePerception: 359176,
          fkVille: 19009,
          fkCompte: '00011-00101-000001291036-41',
          refernceLogirad: 'BF25AA00579',
          fkSite: 37783,
          dateEcheance: '14/02/2024 00:00:00',
          refernceBnp: 'BNP000000000000000000012025KASWIL',
        },
        message: 'success',
        status: '200',
      });
    }

    // Si l'ID n'existe pas
    return HttpResponse.json(
      { message: 'Bon à payer non trouvé', status: '404' },
      { status: 404 }
    );
  }),

  // Mock pour les tests de connectivité
  http.get('/api/test', () => {
    return HttpResponse.json({ status: 'ok', message: 'Proxy working' });
  }),

  http.get('/api/ping', () => {
    return HttpResponse.json({ pong: true, timestamp: Date.now() });
  }),
];
