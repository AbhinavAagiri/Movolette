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
    // Never ship .map files next to the bundle. This keeps the deployed dist
    // folder to the code that actually runs; it is not a security boundary,
    // since minified client code is still readable in the browser.
    sourcemap: false,
  },
});
