import { Plugin } from 'vite';
import * as sass from 'sass-embedded';
import { extname, basename, join, resolve, isAbsolute } from 'node:path';
import { glob } from 'glob';
import { getPrefixImporter } from './utils';


export interface ThemesGeneratorConfig {
  /**
   * Themes configurations folder
   * @default './themes'
   */
  themes?: string;

  varPrefix?: string;

  compress?: boolean;
}

export default async function themes(config?: ThemesGeneratorConfig): Promise<Plugin> {
  const { themes, varPrefix = '', compress } = config || {};
  const projectRootDir = resolve(import.meta.dirname, '..');
  const themesDir = themes && isAbsolute(themes) ? themes : join(projectRootDir, (themes || './themes/*'));

  let isGenerated = false;

  return {
    name: 'vite:themes',
    apply: 'build',
    async generateBundle(options) {
      if (isGenerated) return;
      if (!options.dir) throw new Error('No output dir defined');
      const themesFiles = await glob(themesDir);

      for (const themesFile of themesFiles) {
        if (extname(themesFile) !== '.scss') {
          continue;
        }

        const results = await sass.compileAsync(themesFile, {
          style: compress ? 'compressed' : 'expanded',
          importers: [getPrefixImporter(varPrefix)],
        });

        this.emitFile({
          type: 'asset',
          fileName: `theme/${basename(themesFile).replace('.scss', '.css')}`,
          source: results.css,
        });
      }

      isGenerated = true;
    },
  }
}