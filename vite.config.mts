/// <reference types="vitest" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { peerDependencies } from './package.json';

export default defineConfig({
  appType: 'custom',
  build: {
    target: 'esnext',
    minify: false,
    cssTarget: resolve(__dirname, 'src/styles.css'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
    },
    outDir: resolve(__dirname, 'dist'),
  },
  plugins: [react()],
});