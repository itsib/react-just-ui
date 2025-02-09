/// <reference types="vite/client" />
/// <reference types="vitest" />
import { resolve, extname } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { glob } from 'glob';
import { defineConfig, type UserConfig } from 'vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import copy from 'vite-plugin-cp';
import pkg from './package.json';
import generatePackageJson from './plugins/vite-generate-package-json';
import bundleReport from './plugins/vite-bundle-report';
import themes from './plugins/vite-themes';
import replacer from './plugins/vite-replacer';
import { getPrefixImporter } from './plugins/utils';

const PREFIX = 'ui';

export default defineConfig(async ({ mode }) => {
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
      PREFIX: JSON.stringify(PREFIX),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          importers: [getPrefixImporter(PREFIX)],
        },
      },
    },
    build: {
      minify: true,
      cssCodeSplit: true,
      sourcemap: false,
      lib: {
        name: 'ReactJustUI',
        entry: { ...entries },
        formats: ['es', 'cjs'],
      },
      emptyOutDir: false,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        treeshake: 'smallest',
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
      replacer({ prefix: PREFIX }),
      react(),
      themes({
        themes: resolve(__dirname, 'src/themes/*'),
        varPrefix: PREFIX,
        compress: true,
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
      name: pkg.name as string,
      css: false,
      include: ['tests/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      globals: true,
      environment: 'jsdom',
      restoreMocks: true,
      setupFiles: 'tests/test-setup.ts',
    },
  } as UserConfig;
});

async function getEntries(): Promise<Record<string, string>> {
  const components = await glob('src/!(*.d).{tsx,ts}', { cwd: __dirname });
  const utilities = await glob('src/utils/!(*.d).ts', { cwd: __dirname });

  const entries: Record<string, string> = {};

  // Components entries
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const name = component.replace(/^src\//, '').replace(new RegExp(`${extname(component)}$`), '');

    entries[name] = resolve(__dirname, component);
  }

  // Utilities entries
  for (let i = 0; i < utilities.length; i++) {
    const utility = utilities[i];
    const name = utility.replace(/^src\//, '').replace(new RegExp(`${extname(utility)}$`), '');

    entries[name] = resolve(__dirname, utility);
  }

  // Add other libs
  entries['validators/index'] = resolve(__dirname, 'src/validators/index.ts');

  return entries;
}