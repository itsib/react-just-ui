import { defineConfig, loadConfigFromFile, mergeConfig, UserConfig } from 'vite';
import { resolve } from 'node:path';

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
  })

});