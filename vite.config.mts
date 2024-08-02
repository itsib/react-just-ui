/// <reference types="vitest" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import dts from 'vite-plugin-dts'
import { peerDependencies } from './package.json';

export default defineConfig(async ({ mode, command }: ConfigEnv): Promise<UserConfig>  => {
  console.log(mode, command);
  return {
    appType: 'custom',
    build: {
      target: 'esnext',
      minify: mode === 'production',
      // sourcemap: true,
      cssTarget: mode === 'production' ? undefined : resolve(__dirname, 'src/styles.css'),
      cssMinify: 'esbuild',
      cssCodeSplit: false,
      emptyOutDir: true,
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
    plugins: [
      dts({ rollupTypes: true }),
      react(),
    ],
  }
});