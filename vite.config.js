import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// Dev-only: rewrite /foo and /foo/ to /foo.html if a matching static file exists in /public/.
// In production, Vercel's filesystem handler does this automatically; this keeps dev parity.
const staticHtmlFallback = () => ({
  name: 'static-html-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url || '/';
      const clean = url.split('?')[0].replace(/\/$/, '');
      if (clean && !clean.endsWith('.html') && !clean.includes('.')) {
        const target = join(server.config.publicDir, `${clean}.html`);
        if (existsSync(target)) {
          req.url = `${clean}.html${url.includes('?') ? url.slice(url.indexOf('?')) : ''}`;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), staticHtmlFallback()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          vendor: ['react', 'react-dom', 'zustand', 'framer-motion', 'gsap'],
        },
      },
    },
  },
})
