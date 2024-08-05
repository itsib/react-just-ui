/// <reference types="vitest" />
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import autoprefixer from 'autoprefixer'
import postcssNesting from 'postcss-nesting'
import { peerDependencies } from './package.json';
import dts from 'vite-plugin-dts'

function types() {
  const dtsInstance = dts({ rollupTypes: true }) as any;

  return {
    ...dtsInstance,
    configResolved(config: UserConfig, env: ConfigEnv) {
      return dtsInstance.configResolved(
        {
          ...config,
          build: {
            ...config.build,
            lib: {
              ...config.build!.lib,
              entry: {
                index: (config.build!.lib as any)!.entry.index,
              }
            },
          },
        },
        env,
      );
    },
  }
}


export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig>  => {
  return {
    appType: 'custom',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          postcssNesting(),
        ],
      },
    },
    assetsInclude: '',
    build: {
      target: 'esnext',
      minify: mode === 'production',
      cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      cssMinify: 'esbuild',
      cssCodeSplit: true,
      emptyOutDir: true,
      lib: {
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
          'css/default': resolve(__dirname, 'src/theme/default.css'),
        },
        name: 'index',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
      },
      outDir: resolve(__dirname, 'dist'),
    },
    plugins: [
      react(),
      types(),
    ],
  }
});