import { defineConfig, UserConfig } from 'vite';
import { postcss } from '../theme.config';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return {
    mode,
    server: { open: false },
    css: { postcss },
  }
});