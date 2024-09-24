import { defineConfig, UserConfig } from 'vite';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  return { mode }
});