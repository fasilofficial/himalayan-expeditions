// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import customErrorOverlayPlugin from './vite-error-overlay-plugin.js';

export default defineConfig({
  output: 'static',
  integrations: [tailwind(), react()],
  vite: {
    plugins: [customErrorOverlayPlugin()],
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'framer-motion',
        'date-fns',
        'clsx',
        'class-variance-authority',
        'tailwind-merge',
        '@radix-ui/*',
        'zod',
      ],
    },
  },
  devToolbar: { enabled: false },
  image: { domains: ['static.wixstatic.com'] },
  server: { allowedHosts: true, host: true },
  security: { checkOrigin: false },
});
