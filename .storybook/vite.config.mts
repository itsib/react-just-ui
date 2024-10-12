/// <reference types="vite/client" />
/// <reference types="vitest" />
import { defineConfig, loadConfigFromFile, mergeConfig, UserConfig } from 'vite';
import { resolve } from 'node:path';
import { watchAndRun } from 'vite-plugin-watch-and-run';

export default defineConfig(async ({ mode, command }): Promise<UserConfig> => {
  const rootConfig = (await loadConfigFromFile({ mode, command }, resolve(__dirname, '../vite.config.mts')))!.config;

  return mergeConfig(rootConfig, {
    mode,
    appType: 'custom',
    resolve: {
      alias: {
        '@': resolve(__dirname, '../src'),
        'react-just-ui': resolve(__dirname, '../src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      watchAndRun([
        {
          name: 'build',
          watchKind: ['add', 'change', 'unlink'],
          watch: resolve(__dirname, '../src/**/*.*'),
          run: 'npm run build',
          delay: 300
        }
      ]),
    ],
  });
});