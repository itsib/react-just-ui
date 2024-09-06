/// <reference types="vite/client" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
    mode,
    appType: 'custom',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@types': resolve(__dirname, 'src/types.ts'),
        '@validators': resolve(__dirname, 'src/validators'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
    },
    define: {
      'process.env.NODE_ENV': mode,
    },
    css: {
      modules: {},
      postcss: {
        plugins: [
          postcssImport(),
          autoprefixer(),
          postcssNesting(),
        ],
      },
    },
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, 'dist'),
    },
    plugins: [
      react(),
      libInjectCss(),
    ],
  }
});