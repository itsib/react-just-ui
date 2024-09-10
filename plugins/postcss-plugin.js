/// <reference types="rollup" />
import postcss from 'postcss';
import path from 'node:path';
import { createFilter } from '@rollup/pluginutils';
import fs from 'node:fs/promises';

/**
 * Plugin configuration
 *
 * @typedef {Object} CssLoaderOptions
 * @prop {boolean} [codeSplit=false] If false, all css files will be compiled into one file.
 * @prop {boolean} [minify=false]  Minimize the build size
 * @prop {(string | string[])} [cssTarget='esnext']  {@link https://esbuild.github.io/api/#target}
 * @prop {(ReadonlyArray<string|RegExp>|string|RegExp|null)} [include]
 * @prop {(ReadonlyArray<string|RegExp>|string|RegExp|null)} [exclude]
 * @prop {import('postcss').Plugin[]} [plugins]
 */
/**
 * File cache content
 * @typedef {Object} CssFileCache
 * @prop {string} id
 * @prop {string} resolvedId
 * @prop {boolean} isEntry
 * @prop {string} [importer]
 * @prop {string} [source] Source code
 * @prop {string} [code] Compiled and minified code
 * @prop {*} map
 */
/** @typedef {import('rollup').OutputAsset} OutputAsset */
/** @typedef {import('rollup').OutputChunk} OutputChunk */
/** @typedef {import('rollup').SourceDescription} SourceDescription */
/**
 * @typedef {Object} ResolveIdOptions
 * @prop {Record<string, string>} attributes
 * @prop {{[plugin: string]:any}} [custom]
 * @prop {boolean} [isEntry]
 */

function isCss(id) {
  return id.slice(-4) === '.css';
}

function isJavaScript(id) {
  return id.slice(-3) === '.js' || id.slice(-4) === '.mjs';
}

/**
 * We consider the directory common to the two file paths to be the root directory.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @returns {string}
 */
function getRootDir(inputPath, outputPath) {
  const inputSegments = inputPath.split('/');
  const outputSegments = outputPath.split('/');

  const count = Math.min(inputSegments.length, outputSegments.length);
  let rootDir = '';
  for (let i = 0; i < count; i++) {
    if (inputSegments[i] === outputSegments[i]) {
      rootDir += inputSegments[i] + '/';
    } else {
      break;
    }
  }
  return rootDir ? rootDir : '/';
}

/**
 * Compute entry name by id and output path
 * @param id
 * @param outputPath
 * @returns {string}
 */
function getEntryName(id, outputPath) {
  const root = getRootDir(id, outputPath);
  const entryName = path.relative(root, id);

  const filename = entryName.replace(/^(?:src|lib)\//, '');
  const extname = path.extname(filename);

  if (extname) {
    return filename.slice(0, -extname.length);
  }
  return filename;
}

/**
 * Creates CSS bundles linked each module
 *
 * @arg {CssLoaderOptions} pluginOptions
 *
 * @return {import('rollup').Plugin}
 */
export default function postcssPlugin(pluginOptions) {
  /** @type {import('rollup').RollupOptions} */
  let rollupOptions;

  /**
   * ECM modules to css file import
   * @type {Map<string, CssFileCache>}
   */
  const cssImports = new Map();

  const filter = createFilter(pluginOptions.include || ['**/*.css'], pluginOptions.exclude);

  const PostCss = postcss([
    ...(pluginOptions.plugins ?? []),
  ]);

  function getModuleNameById(id) {
    const outputDir = rollupOptions.output?.[0]?.dir;
    if (!outputDir || !rollupOptions.input) {
      return null;
    }

    if (typeof rollupOptions.input === 'string' || (typeof rollupOptions.input === 'object' && Array.isArray(rollupOptions.input))) {
      return getEntryName(id, outputDir);
    }

    if (typeof rollupOptions.input !== 'object') {
      return null;
    }

    for (const [entryName, entryId] of Object.entries(rollupOptions.input)) {
      if (entryId === id) {
        return entryName;
      }
    }
    return getEntryName(id, outputDir);
  }

  return {
    name: 'postcss-css',
    /**
     * Save rollup options
     * @param {import('rollup').RollupOptions} options
     */
    options(options) {
      rollupOptions = options;

      return options;
    },
    /**
     * Defines a custom resolver. A resolver can be useful for e.g.
     * locating third-party dependencies.
     *
     * @param {string} id
     * @param {string|undefined} importer
     * @param {ResolveIdOptions} options
     *
     * @returns {import('rollup').ResolveIdResult}
     */
    async resolveId(id, importer, options) {
      if (!isCss(id) || !filter(id)) return null;

      console.log('id', id, options.isEntry);
      return id;
    },
    /**
     * Transform CSS with the PostCSS plugin
     *
     * @param {string} code - Source code
     * @param {string} id - File ID (file path)
     *
     * @returns {Promise<string|null|Partial<SourceDescription>>}
     */
    async transform(code, id) {
      if (!isCss(id)) return null;

      const result = await PostCss.process(code, { from: id });

      result.warnings().forEach(warn => this.warn(warn.toString()));

      const name = getModuleNameById(id);
      const referenceId = this.emitFile({
        type: 'asset',
        id: id,
        name: name,
        fileName: `${name}.css`,
        originalFileName: id,
        source: result.css,
        needsCodeReference: false,
      });

      return {
        code: `export default import.meta.ROLLUP_FILE_URL_${referenceId};`,
        moduleSideEffects: true,
      };
    },
    /**
     * Hook for build generation
     *
     * @param {import('rollup').OutputOptions} options
     * @param {{[fileName: string]:OutputAsset|OutputChunk}} bundles
     *
     * @returns {Promise<void>}
     */
    async generateBundle(options, bundles) {
      if (!(options.dir || options.file)) return;

      const filenames = Object.keys(bundles);
      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const bundle = bundles[filename];

        // Remove empty bundles
        if (isJavaScript(filename) && isCss(bundle.facadeModuleId)) {
          delete bundles[filename];
        }
      }

      this.info(`Files generated successfully.`);
    },
  };
}