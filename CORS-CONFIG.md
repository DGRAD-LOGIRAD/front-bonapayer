# Configuration CORS et Proxy

## Vue d'ensemble

Cette application est configurée pour gérer les problèmes CORS en utilisant différentes stratégies selon l'environnement :

- **Mode Développement** : Utilise un proxy Vite pour contourner les CORS
- **Mode Production** : Utilise l'URL directe avec headers CORS appropriés

## Configuration

### Mode Développement

Le proxy Vite est configuré dans `vite.config.ts` :

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.dgrad.cloud/ms_bp',
      changeOrigin: true,
      secure: true,
      rewrite: path => path.replace(/^\/api/, '/api'),
    },
  },
}
```

**Utilisation :**

- L'API est accessible via `/api` en mode développement
- Le proxy redirige automatiquement vers `https://api.dgrad.cloud/ms_bp/api`
- Aucun problème CORS en développement

### Mode Production

L'API utilise l'URL directe avec headers CORS :

```typescript
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://api.dgrad.cloud/ms_bp/api';
  }
  return '/api';
};
```

**Headers CORS configurés :**

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

## Fichiers de configuration

### `vite.config.ts`

- Configuration du proxy pour le mode développement
- Redirection `/api` → `https://api.dgrad.cloud/ms_bp/api`

### `src/services/api.ts`

- Configuration dynamique de l'URL selon l'environnement
- Headers CORS pour la production
- Gestion d'erreurs CORS spécifique

### `public/_headers`

- Headers de sécurité pour la production
- Configuration CORS au niveau du serveur web

## Test

### Mode Développement

```bash
pnpm run dev
# L'API est accessible via http://localhost:5173/api
```

### Mode Production

```bash
pnpm run build
pnpm run preview
# L'API utilise l'URL directe https://api.dgrad.cloud/ms_bp/api
```

## Dépannage

### Erreurs CORS en développement

1. Vérifiez que le serveur de développement est démarré
2. Vérifiez la configuration du proxy dans `vite.config.ts`
3. Vérifiez que l'URL de l'API est correcte

### Erreurs CORS en production

1. Vérifiez que l'API supporte les CORS
2. Vérifiez les headers dans `src/services/api.ts`
3. Vérifiez la configuration du serveur web

## Notes importantes

- Le proxy Vite ne fonctionne qu'en mode développement
- En production, l'API doit supporter les CORS
- Les headers CORS sont configurés côté client
- Pour une sécurité maximale, configurez les CORS côté serveur
