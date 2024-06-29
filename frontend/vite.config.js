import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envVars from './envexport';

export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: envVars.backend_uri,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '')
      }
    }
  },
  plugins: [react()]
});
