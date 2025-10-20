import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy pour ms-bp/reg/api/... (bon-à-payer DGRAD) - DOIT être en premier
      // Front appelle: /ms-bp/reg/api/v1/bon-a-payer
      '/ms-bp': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        // Pas de réécriture nécessaire, le chemin reste identique
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },

      // Proxy spécifique pour les endpoints ms_bp du backend DGRAD
      // Front appelle: /api/ms_bp/...  →  Côté cible: /ms_bp/api/...
      '/api/ms_bp': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/ms_bp/, '/ms_bp/api'),
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },

      '/api-utilisateur': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },

      // Règle générale /api en dernier pour éviter les conflits
      '/api': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
    allowedHosts: ['bonapayer.dgrad.cloud'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk pour les composants UI communs
          'ui-components': [
            'react-router-dom',
            'lucide-react',
            'sonner',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          // Chunk pour les composants Radix UI
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
          ],
          // Chunk pour React Query et Axios
          'data-fetching': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
            'axios',
          ],
          // Chunk pour les formulaires
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Chunk pour PDF
          pdf: ['@react-pdf/renderer'],
        },
      },
    },
    // Augmenter la limite de taille des chunks
    chunkSizeWarningLimit: 1000,
  },
});
