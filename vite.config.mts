/// <reference types="vite/client" />
import path, { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { glob } from 'glob';
import pkg from './package.json';
import generatePackageJson from './plugins/vite-generate-package-json';
import bundleReport from './plugins/vite-bundle-report';
import themes from './plugins/vite-themes';
import copy from 'vite-plugin-cp';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const entries = await getEntries();

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
      postcss: {
        plugins: [
          autoprefixer(),
          postcssNesting(),
        ],
      }
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
      themes({
        configs: './themes',
        prefix: 'jj',
        include: ['./src/css/components/*'],
      }),
      libInjectCss(),
      generatePackageJson(),
      bundleReport({ enableGzip: true, outputPath: '.storybook/public/report/',  }),
      copy({
        targets: [
          { src: 'README.md', dest: 'dist/' },
        ],
      }),
    ],
  }
});

async function getEntries(): Promise<Record<string, string>> {
  const entries: Record<string, string> = {};

  // Search components
  (await glob('src/!(*.d).{tsx,ts}', { cwd: __dirname })).reduce((acc, file) => {
    const key = file.replace(/^src\//, '').replace(new RegExp(`${path.extname(file)}$`), '');
    acc[key] = path.resolve(__dirname, file);
    return acc;
  }, entries);

  // Add other libs
  entries['validators/index'] = path.resolve(__dirname, 'src/validators/index.ts');
  entries['utils/index'] = path.resolve(__dirname, 'src/utils/index.ts');

  return entries;
}