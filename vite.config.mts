/// <reference types="vite/client" />
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { ConfigEnv, defineConfig, UserConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { glob } from 'glob';

export default defineConfig(async ({mode}: ConfigEnv): Promise<UserConfig> => {
  return {
    appType: 'custom',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@types': resolve(__dirname, 'src/types.ts'),
        '@components': resolve(__dirname, 'src/components'),
        '@validators': resolve(__dirname, 'src/validators'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
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
      target: 'esnext',
      minify: mode === 'production',
      cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      cssMinify: 'esbuild',
      cssCodeSplit: true,
      emptyOutDir: true,
      lib: {
        formats: ['es'],
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
        },
      },
      rollupOptions: {
        input: Object.fromEntries(
          glob.sync('src/**/!(*.d).{ts,tsx,css}')
            .filter(file => !file.startsWith('src/css/components') && !file.startsWith('src/types'))
            .map(file => {
              const fileWithoutExt = file.replace(new RegExp(`${extname(file)}$`), '');

              return [
                relative('src', fileWithoutExt),
                fileURLToPath(new URL(file, import.meta.url)),
              ]
            }),
        ),
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        output: {
          assetFileNames: '[name][extname]',
          entryFileNames: '[name].js',
          preserveModules: false,
        }
      },
      outDir: resolve(__dirname, 'dist'),
    },
    plugins: [
      react(),
      libInjectCss(),
      dts({include: ['src']}),
    ],
  }
});