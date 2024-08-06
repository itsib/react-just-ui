import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { svgLoader } from './vite/svg-loader';

export default defineConfig(async () => {
  const { name, version } = JSON.parse(await readFile(resolve(__dirname, '..', 'package.json'), 'utf8'));

  return {
    define: {
      'import.meta.env.VITE_LIB_NAME': JSON.stringify(name),
      'import.meta.env.VITE_LIB_VERSION': JSON.stringify(version),
    },
    server: {
      port: 3009,
    },
    plugins: [react(), svgLoader()],
  }
})
