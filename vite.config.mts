/// <reference types="vite/client" />
import path, { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import postcssVariables from 'postcss-advanced-variables';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import * as glob from 'glob';
import pkg from './package.json';
import packagePkg from './plugins/vite-generate-pkg';
import bundleReport from './plugins/vite-bundle-report';
import copy from 'vite-plugin-cp';
import { ThemeConfig } from './theme.config';

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
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    css: {
      modules: {},
      postcss: {
        plugins: [
          postcssVariables({
            variables(name: string) {
              const fields = name.split('-');
              let value: any = ThemeConfig.minimal;

              for (const field of fields) {
                if (field && value && field in value) {
                  value = value[field];
                } else {
                  break;
                }
              }
              if (typeof value === 'object' || value == null) {
                return 'none';
              } else if (typeof value === 'number') {
                return `${value}px`;
              } else {
                return value;
              }
            },
            unresolved: 'warn',
          }),
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
          globals: {
            'react': 'react',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
          },
        },
      },
    },
    plugins: [
      react(),
      libInjectCss(),
      packagePkg(),
      bundleReport({ enableGzip: true, outputPath: '.storybook/public/report/',  }),
      copy({
        targets: [
          { src: 'README.md', dest: 'dist/' },
        ],
      }),
    ],
  }
});