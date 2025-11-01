import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
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
      '/ms-bp/reg': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
      },

      '/api/ms_bp': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/ms_bp/, '/ms_bp/api'),
      },

      '/api-utilisateur': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
      },

      '/api': {
        target: 'https://api.dgrad.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
    allowedHosts: ['bonapayer.dgrad.cloud'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ui-components': [
            'react-router-dom',
            'lucide-react',
            'sonner',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
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
          'data-fetching': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
            'axios',
          ],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          pdf: ['@react-pdf/renderer'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
