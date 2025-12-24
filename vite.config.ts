import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import manifest from './extension/manifest.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    crx({ manifest }),
    // Fix for @crxjs/vite-plugin stripping icon fields
    {
      name: 'fix-manifest-icons',
      writeBundle() {
        const manifestPath = resolve(cwd(), 'dist/manifest.json');
        const builtManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

        // Add back the icons that @crxjs strips
        builtManifest.icons = {
          '16': 'icons/rose16.png',
          '32': 'icons/rose32.png',
          '48': 'icons/rose48.png',
          '128': 'icons/rose128.png',
          '256': 'icons/rose256.png',
          '512': 'icons/rose512.png',
        };

        builtManifest.action.default_icon = {
          '16': 'icons/rose16.png',
          '32': 'icons/rose32.png',
          '48': 'icons/rose48.png',
          '128': 'icons/rose128.png',
          '256': 'icons/rose256.png',
          '512': 'icons/rose512.png',
        };

        writeFileSync(manifestPath, JSON.stringify(builtManifest, null, 2));
      },
    },
  ],
  root: 'extension',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Disable CSS code splitting to avoid document.* injection in service worker
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          return 'assets/[name]-[hash][extname]';
        },
        // Disable dynamic imports in service worker to avoid document.* injection
        inlineDynamicImports: false,
      },
    },
  },
  assetsInclude: ['**/*.wasm', '**/*.woff', '**/*.woff2'],
});
