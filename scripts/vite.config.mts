import { defineConfig, UserConfig } from "vite";
import { resolve } from 'node:path';

export default defineConfig(() => ({
  appType: 'custom',
  root: resolve(__dirname),
} satisfies UserConfig));