import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Movolette is a static, client-only application. The build in `dist` can be
// served by Cloudflare Pages or Vercel Hobby with no functions or server.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
