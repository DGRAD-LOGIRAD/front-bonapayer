import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      proxy:
        env.VITE_PROXY_ENABLED === 'true'
          ? {
              '/api': {
                target:
                  env.VITE_PROXY_TARGET || 'https://api.dgrad.cloud/ms_bp',
                changeOrigin: true,
                secure: true,
                rewrite: path => path.replace(/^\/api/, '/api'),
              },
            }
          : undefined,
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
  };
});
