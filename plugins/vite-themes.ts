import { Plugin } from 'vite';
import esbuild from 'esbuild';
import postcss from 'postcss';
import fs from 'node:fs/promises';
import { extname, join, resolve, isAbsolute } from 'node:path';
import { flatten } from './utils';
import { glob } from 'glob';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

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

  // Create PostCSS instance
  const PostCSS = postcss([autoprefixer(), postcssNesting()]);

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

  async function processCss(code: string, onWarn: (msg: string) => void) {
    const postcssResult = await PostCSS.process(code, { map: false });
    postcssResult.warnings().forEach((warning) => onWarn(warning.toString()));

    const result = await esbuild.transform(postcssResult.css, { loader: 'css', minify: true });
    result.warnings.forEach((warning) => onWarn(warning.toString()));

    return result.code;
  }

  return {
    name: 'vite:themes',
    apply: 'build',
    async generateBundle(options) {
      if (isGenerated) return;
      if (!options.dir) throw new Error('No output dir defined');

      let includesCss = '';
      const files = await glob(include, { ignore: exclude, absolute: true });
      for (let i = 0; i < files.length; i++) {
        includesCss += await fs.readFile(files[i], 'utf8');
        includesCss += '\n\n';
      }

      includesCss = await processCss(includesCss, this.warn);

      for (const themeName of themeNames) {
        let css = renderVariablesCss(configs[themeName], prefix);
        css = await processCss(css, this.warn);
        css = css + includesCss;

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
  }
}

function renderVariablesCss(theme: Record<string, any>, prefix: string = ''): string {
  const formatValue = (value: string): string => {
    if (/^[0-9\s]+$/.test(value)) {
      return value;
    }
    return `"${value}"`;
  };
  const formatName = (name: string): string => {
    let output = prefix ? `--${prefix}-` : '--';
    output += name
      .replace('background', 'bg')
      .replace('foreground', 'fg');
    return output;
  }
  const renderScheme = (selector: string, scheme: Record<string, any>) => {
    let output = `${selector} {\n`;
    const names = Object.keys(scheme);
    for (const name of names) {
      output += `  ${formatName(name)}: ${formatValue(scheme[name])};\n`;
    }
    return output + '}\n\n';
  };

  return renderScheme('html', theme.light) + renderScheme('html.dark', theme.dark);
}