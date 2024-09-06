import { rollup, RollupOptions, InputOption } from 'rollup';
import { resolve, dirname, extname, relative } from 'node:path';
import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import ts from 'typescript';
import * as glob from 'glob';
import terser from '@rollup/plugin-terser';
import { fileURLToPath } from 'node:url';

// @ts-ignore
import { log, loading } from './logger';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PKG = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

interface CreateConfigOpts {
  input: InputOption;
  format: 'cjs' | 'es' | 'esm' | 'umd';
  minify?: boolean;
  postcss?: boolean;
  env?: 'production';
}

function createRollupConfig(opts: CreateConfigOpts): RollupOptions {
  const format = opts.format === 'es' ? 'esm' : opts.format;
  // Should uglify output code
  const minify = format !== 'esm' && opts.minify != null ? opts.minify : false;

  return {
    input: opts.input,
    external: [
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      ...Object.keys(PKG.peerDependencies),
    ],
    plugins: [
      ...(opts.postcss ? [
        postcss({
          onExtract(asset: any) {
            console.log(asset);
            return true;
          },
          extract: true,
          plugins: [
            postcssImport(),
            autoprefixer(),
            postcssNesting(),
          ],
        }),
      ] : []),
      nodeResolve(),
      typescript({
        tsconfig: 'tsconfig.build.json',
        typescript: ts,
        noEmit: true,
      }),
      commonjs(),
      ...(minify ? [
        terser({
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 2020,
          module: format === 'esm',
          toplevel: opts.format === 'cjs' || format === 'esm',
        }),
      ] : []),
    ],
  };
}

async function generateTypes() {
  return new Promise<void>(async (resolve, reject) => {
    const stop = loading(log('Generate types declaration...', 'gray', true, 2));

    exec('tsc --project tsconfig.declare.json', (err, stdout, stderr) => {
      if (err) {
        const frames = stdout.split('\n\n').filter(Boolean);
        const message = `${stderr}\n${frames[frames.length - 1]}`;

        stop();
        return reject(message);
      }
      stop(log('✔ ', 'green', true, 2) + log('Files with .d.ts generated.', 'gray', false, 2));
      resolve();

    });
  });
}

async function buildCJS() {
  const stop = loading(log('Building ESM modules...', 'gray', true, 2));

  const input = Object.fromEntries(
    glob.sync('src/**/!(*.d).{ts,tsx,css}', { cwd: ROOT })
      .filter(file => !file.startsWith('src/types') && !file.endsWith('.css'))
      .map(file => {
        const src = resolve(ROOT, file);

        const fileWithoutExt = file.replace(new RegExp(`${extname(file)}$`), '');

        let dist = relative('src', fileWithoutExt);
        if (dist.startsWith('components')) {
          dist = dist.replace(/^components\//, '');
          dist += dist.endsWith('index') ? '.cjs' : ''

        }

        return [ dist, src ];
      }),
  );

  const config = createRollupConfig({
    input,
    format: 'cjs',
    minify: true,
    postcss: true,
    env: 'production',
  });

  const bundles = await rollup(config);

  const result = await bundles.write({
    name: 'ReactJustUI',
    format: 'cjs',
    dir: resolve(ROOT, 'dist'),
    assetFileNames: '[name][extname]',
    entryFileNames: '[name].js',
    preserveModules: false,
  });

  stop(log('✔ ', 'green', true, 2) + log('ESM modules generated.', 'gray', false, 2));


  console.log(result);
}

async function run() {
  log(`Building package ${log(PKG.name, 'green', false, 4)}.`, 'yellow', false, 0).render();

  await generateTypes();

  await buildCJS();
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });