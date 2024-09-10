/// <reference types="vite/client" />
import path, { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import * as glob from 'glob';
import pkg from './package.json';
import packageJsonGen from './plugins/vite-plugin-package-json';
import { analyzer } from 'vite-bundle-analyzer'

const entries = Object.fromEntries(
  glob.sync('src/!(*.d).{tsx,ts}', { cwd: __dirname })
    .map(file => [
      file.replace(/^src\//, '')
        .replace(new RegExp(`${path.extname(file)}$`), ''),
      path.resolve(__dirname, file),
    ])
    .concat([
      ['validators/index', path.resolve(__dirname, 'src/validators/index.ts')],
      ['utils/index', path.resolve(__dirname, 'src/utils/index.ts')],
      ['theme/minimal', path.resolve(__dirname, 'src/css/minimal.css')],
    ])
);

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
    mode,
    appType: 'custom',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.NODE_ENV': 'production',
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
      minify: true,
      lib: {
        name: 'ReactJustUI',
        entry: { ...entries },
        formats: ['es', 'cjs'],
      },
      emptyOutDir: false,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        external: [
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          ...Object.keys(pkg.peerDependencies)
        ],
        output: {
          globals: { react: 'React' },
        },
      },
    },
    plugins: [
      react(),
      libInjectCss(),
      packageJsonGen(),
      analyzer({
        reportTitle: 'ReactJustUI',
        analyzerMode: 'json',
        fileName: '../demo/public/stat',
      }),
    ],
  }
});