/// <reference types="vite/client" />
/// <reference types="vitest" />
import { resolve, extname } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { glob } from 'glob';
import { defineConfig, UserConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import copy from 'vite-plugin-cp';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssImport from 'postcss-import';
import pkg from './package.json';
import generatePackageJson from './plugins/vite-generate-package-json';
import bundleReport from './plugins/vite-bundle-report';
import themes from './plugins/vite-themes';

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
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`,
        },
      },
      // postcss: {
      //   plugins: [
      //     postcssImport(),
      //     autoprefixer(),
      //     postcssNesting(),
      //   ],
      // }
    },
    build: {
      minify: true,
      cssCodeSplit: true,
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
          manualChunks: {
            'utils/index': [
              resolve(__dirname, 'src/utils/index.ts'),
              resolve(__dirname, 'src/utils/class-names.ts'),
            ]
          }
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
    test: {
      css: false,
      include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      globals: true,
      environment: 'node',
      // setupFiles: 'tests/setup-tests.ts',
      restoreMocks: true,
    },
  }
});

async function getEntries(): Promise<Record<string, string>> {
  const entries: Record<string, string> = {};
  // Search components
  (await glob('src/!(*.d).{tsx,ts}', { cwd: __dirname })).reduce((acc, file) => {
    const key = file.replace(/^src\//, '').replace(new RegExp(`${extname(file)}$`), '');
    acc[key] = resolve(__dirname, file);
    return acc;
  }, entries);

  // Add other libs
  entries['validators/index'] = resolve(__dirname, 'src/validators/index.ts');
  entries['utils/index'] = resolve(__dirname, 'src/utils/index.ts');

  return entries;
}