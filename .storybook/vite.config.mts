import { defineConfig, UserConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
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
  }
});