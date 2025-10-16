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
      '/api': {
        target: 'http://69.62.105.205:8080/ms_bp',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
        configure: proxy => {
          proxy.on('error', err => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
});
