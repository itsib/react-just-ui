import { rollup, RollupOptions, InputOption } from 'rollup';
import { resolve, dirname, extname, relative } from 'node:path';
import { exec } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
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
import { log, loading } from './scripts/logger.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)));



interface CreateConfigOpts {
  input: InputOption;
  format: 'cjs' | 'es' | 'esm' | 'umd';
  minify?: boolean;
  postcss?: boolean;
  env?: 'production';
}

function createRollupConfig(pkg: Record<string, any>, opts: CreateConfigOpts): RollupOptions {
  const format = opts.format === 'es' ? 'esm' : opts.format;
  // Should uglify output code
  const minify = format !== 'esm' && opts.minify != null ? opts.minify : false;

  return {
    input: opts.input,
    external: [
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      ...Object.keys(pkg.peerDependencies),
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
        tsconfig: 'tsconfig.json',
        typescript: ts,
        noEmit: true,
        noForceEmit: false,
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

async function cleanDist() {
  log('  Clean dist...', 'gray', false, 2).render();

  try {
    await rm(resolve(ROOT, 'dist'), { force: true, recursive: true });

    log(`✔ ${log(`Success`, 'gray', false, 2)}`, 'green', true, 2).render();
  } catch (e) {
    log(`✗ ${log(`Error`, 'red', false, 2)}`, 'red', true, 2).render();

    console.error(e);
    process.exit(1);
  }
}

async function generateTypes() {
  log('  Generate types declaration...', 'gray', false, 2).render();

  await new Promise<void>(resolve => {

    exec('tsc --project tsconfig.declare.json', (err, stdout, stderr) => {
      if (err) {
        const frames = stdout.split('\n\n').filter(Boolean);
        const message = `${stderr}\n${frames[frames.length - 1]}`;

        log(`✗ ${log(`Error`, 'red', false, 2)}`, 'red', true, 2).render();

        console.error(message);
      }
      resolve();
    });
  });

  log(`✔ ${log(`Success`, 'gray', false, 2)}`, 'green', true, 2).render();
}

async function buildESM(pkg: Record<string, any>) {
  log('  Building ESM modules...', 'gray', false, 2).render();

  const entries = glob.sync('src/!(*.d).{tsx,ts}', { cwd: ROOT })
    .map(file => {
      const src = resolve(ROOT, file);
      const dist = file.replace(/^src\//, '').replace(new RegExp(`${extname(file)}$`), '');

      return [dist, src];
    })
    .concat([
      ['validators/index', resolve(ROOT, 'src/validators/index.ts')],
      ['utils/index', resolve(ROOT, 'src/utils/index.ts')],
    ]);

  const config = createRollupConfig(pkg, {
    input: Object.fromEntries(entries),
    format: 'esm',
    minify: false,
    postcss: true,
    env: 'production',
  });

  const bundles = await rollup(config);

  const result = await bundles.write({
    name: 'ReactJustUI',
    format: 'esm',
    dir: resolve(ROOT, 'dist'),
    entryFileNames: '[name].esm.mjs',
    assetFileNames: '[name]',
    preserveModules: false,
  });

  log(`✔ ${log(`Success`, 'gray', false, 2)}`, 'green', true, 2).render();

  console.log(result);
}

async function buildCJS(pkg: Record<string, any>) {
  const stop = loading(log('Building ESM modules...', 'gray', true, 2));



  const input = Object.fromEntries(
    glob.sync('src/**/!(*.d).{ts,tsx,css}', { cwd: ROOT })
      .filter(file => !file.startsWith('src/types') && !file.endsWith('.css'))
      .map(file => {
        const src = resolve(ROOT, file);

        const fileWithoutExt = file.replace(new RegExp(`${extname(file)}$`), '');

        let dist = relative('src', fileWithoutExt);
        if (dist.startsWith('components')) {
          dist = dist.replace(/^components\//, '').replace(/\/index$/, '')
        }

        return [ dist, src ];
      }),
  );

  const config = createRollupConfig(pkg, {
    input,
    format: 'esm',
    minify: true,
    postcss: true,
    env: 'production',
  });

  const bundles = await rollup(config);

  const result = await bundles.write({
    name: 'ReactJustUI',
    format: 'esm',
    dir: resolve(ROOT, 'dist'),
    entryFileNames: '[name].esm.mjs',
    preserveModules: false,
  });

  stop(log('✔ ', 'green', true, 2) + log('ESM modules generated.', 'gray', false, 2));


  console.log(result);
}

async function run() {
  const pkg = JSON.parse(await readFile(resolve(ROOT, 'package.json'), 'utf8'));

  log(`Building package ${log(pkg.name, 'green', false, 4)}.`, 'yellow', false, 0).render();

  await cleanDist();

  await generateTypes();

  await buildESM(pkg);
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });