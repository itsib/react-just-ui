import { Plugin } from 'vite';
import esbuild from 'esbuild';
import postcss from 'postcss';
import fs from 'node:fs/promises';
import { extname, join, resolve, isAbsolute } from 'node:path';
import { flatten } from './utils';
import { glob } from 'glob';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import advancedVariables from 'postcss-advanced-variables';

export interface ThemesGeneratorConfig {
  /**
   * Themes configurations folder
   * @default './themes'
   */
  configs?: string;
  /**
   * Include css files in to theme.
   */
  include?: string[];
  /**
   * Exclude files
   */
  exclude?: string[];
  /**
   * Theme variables prefix
   * @example
   * Define prefix "cool"
   *
   * ```js
   * config.prefix = 'cool';
   * ```
   *
   * Output:
   *
   * ```css
   * --cool-color: #aaa;
   * ```
   */
  prefix?: string;
  /**
   * Output directory
   * @default build.outDir value
   */
  output?: string;
}

export default async function themes(config?: ThemesGeneratorConfig): Promise<Plugin> {
  const { configs: _configs, include = [], exclude = [], prefix = '' } = config || {};
  const projectRootDir = resolve(import.meta.dirname, '..');
  const configsDir = _configs && isAbsolute(_configs) ? _configs : join(projectRootDir, (_configs || './themes'));
  let isGenerated = false;
  let warnLog: (msg: string) => void;

  // Read configs
  const configsFiles = await fs.readdir(configsDir, { encoding: 'utf8' });
  const configs: Record<string, Record<string, any>> = {};
  const themeNames: string[] = [];

  // Read all config files
  for (let i = 0; i < configsFiles.length; i++) {
    const configExt = extname(configsFiles[i]);
    if (configExt !== '.json') continue;

    const config = await fs.readFile(join(configsDir, configsFiles[i]), 'utf8').then(parseThemeConfig);
    const themeName = configsFiles[i].replace(configExt, '');
    themeNames.push(themeName);

    configs[themeName] = config;
  }

  async function processCss(code: string, themeName: string, onWarn: (msg: string) => void) {
    const PostCSS = postcss([
      autoprefixer(),
      advancedVariables({
        variables(key: string) {
          return formatCssValue(key, configs[themeName]?.variables ?? {});
        },
        unresolved: 'warn',
      }),
      postcssNesting(),
    ]);
    const postcssResult = await PostCSS.process(code, { map: false });
    postcssResult.warnings().forEach((warning) => onWarn(warning.toString()));

    const result = await esbuild.transform(postcssResult.css, { loader: 'css', minify: true });
    result.warnings.forEach((warning) => onWarn(warning.toString()));

    return result.code;
  }

  function formatCssValue(key: string, scheme: Record<string, any>): string {
    let value: number | string = scheme[key];
    // Value is link to other value
    if (typeof value === 'string' && value.charAt(0) === '$') {
      const keyRef = value.slice(1);
      if (keyRef in scheme) {
        value = scheme[keyRef];
      } else {
        warnLog?.(`Key ${keyRef} not found in theme`);
      }
    }
    if (typeof value === 'number' && !key.includes('z-index')) {
      return `${value}px`;
    }
    return `${value}`;
  }

  function formatCssKey(key: string, prefix: string, isColor?: boolean): string {
    let output = prefix ? `--${prefix}-` : '--';
    output += key
      .replace('.default', '')
      .replace('background', 'bg')
      .replace('foreground', 'fg');

    output = isColor ? output + '-rgb' : output;
    return output;
  }

  function renderScheme(selector: string, scheme: Record<string, any>, prefix: string, isColors?: boolean): string {
    let output = `${selector} {\n`;
    const keys = Object.keys(scheme);
    for (const key of keys) {
      output += `  ${formatCssKey(key, prefix, isColors)}:${formatCssValue(key, scheme)};\n`;
    }
    return output + '}\n\n';
  }

  function renderVariablesCss(theme: Record<string, any>, prefix: string = ''): string {
    return renderScheme('html', theme.light, prefix, true)
      + renderScheme('html.dark', theme.dark, prefix, true)
      + renderScheme('html', theme['css-variables'], prefix);
  }

  return {
    name: 'vite:themes',
    apply: 'build',
    buildStart() {
      warnLog = this.warn;
    },
    async generateBundle(options) {

      if (isGenerated) return;
      if (!options.dir) throw new Error('No output dir defined');

      let includesCss = '';
      const files = await glob(include, { ignore: exclude, absolute: true });
      for (let i = 0; i < files.length; i++) {
        includesCss += await fs.readFile(files[i], 'utf8');
        includesCss += '\n\n';
      }

      for (const themeName of themeNames) {
        let css = renderVariablesCss(configs[themeName], prefix);
        css = await processCss(css + includesCss, themeName, this.warn);

        this.emitFile({
          type: 'asset',
          fileName: `theme/${themeName}.css`,
          source: css,
        });
      }

      isGenerated = true;
    },
  }
}

function parseThemeConfig(themeRaw: string): Record<string, any> {
  const theme = JSON.parse(themeRaw);

  return {
    light: flatten<Record<string, any>, Record<string, any>>(theme.light, { delimiter: '-' }),
    dark: flatten<Record<string, any>, Record<string, any>>(theme.dark, { delimiter: '-' }),
    variables: flatten<Record<string, any>, Record<string, any>>(theme.variables || {}, { delimiter: '-' }),
    'css-variables': flatten<Record<string, any>, Record<string, any>>(theme['css-variables'] || {}, { delimiter: '-' }),
  }
}