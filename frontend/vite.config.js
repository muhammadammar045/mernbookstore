import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // server: {
  //   proxy: {
  //     '/': {
  //       target: "https://mernbookstorefrontend.vercel.app",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api\/v1/, '')
  //     }
  //   }
  // },
  plugins: [react()]
});
