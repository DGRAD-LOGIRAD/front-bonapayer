// Configuration des variables d'environnement
export const env = {
  // Configuration de l'API
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'https://localhost/ms_bp/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // Configuration CORS
  CORS_ENABLED: import.meta.env.VITE_CORS_ENABLED === 'true',
  CORS_ORIGIN: import.meta.env.VITE_CORS_ORIGIN || '*',

  // Configuration du proxy
  PROXY_TARGET: import.meta.env.VITE_PROXY_TARGET || 'https://localhost/ms_bp',
  PROXY_ENABLED: import.meta.env.VITE_PROXY_ENABLED === 'true',

  // Configuration de l'environnement
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Validation des variables d'environnement requises
export const validateEnv = () => {
  const requiredVars = ['VITE_API_BASE_URL'] as const;

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Variables d'environnement manquantes: ${missingVars.join(', ')}`
    );
    console.warn('Utilisation des valeurs par défaut');
  }

  return missingVars.length === 0;
};

// Initialisation de la validation
validateEnv();
