import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import postcssImport from "postcss-import";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";

const ROOT = path.dirname(import.meta.url.replace(/^file:\/\//, ''));
const PKG = JSON.parse(fs.readFileSync(path.resolve(ROOT, 'package.json'), 'utf8'))

function createCjsFileName(file, env) {
  const basename = path.basename(file).replace(path.extname(file), '');
  const dirname = path.dirname(file);
  const extname = path.extname(file);

  return path.resolve(ROOT, dirname, `${basename}.${env}${extname}`);
}

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'ReactJustUI',
      format: 'cjs',
      minify: false,
      file: createCjsFileName(PKG.main, 'dev'),
    },
    {
      name: 'ReactJustUI',
      format: 'cjs',
      file: createCjsFileName(PKG.main, 'prod'),
      minify: true,
    },
  ],
  logLevel: 'debug',
  external: [
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    ...Object.keys(PKG.peerDependencies)
  ],
  plugins: [
    external(),
    resolve(),  // so Rollup can find `ms`
    postcss({
      extract: true,
      plugins: [
        postcssImport(),
        autoprefixer(),
        postcssNesting(),
      ],
    }),
    typescript({
      cwd: ROOT,
      tsconfig: 'tsconfig.build.json',
      typescript: ts,
      clean: true,
      noEmit: true,
      useTsconfigDeclarationDir: true,
    }),
    commonjs(),
    terser({
      output: { comments: false },
      compress: {
        keep_infinity: true,
        pure_getters: true,
        passes: 10,
      },
      ecma: opts.legacy ? 5 : 2020,
      module: isEsm,
      toplevel: opts.format === 'cjs' || isEsm,
      warnings: true,
    }),
  ]
};