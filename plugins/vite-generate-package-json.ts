import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';

export default function generatePkg(): Plugin {
  let formats: string[] = [];
  let entries: Record<string, string> = {};
  let packageJson: Record<string, any> | null = null;
  let isGenerated = false;

  return {
    name: 'vite:generate-package-json',
    apply: 'build',
    async configResolved({ build }) {
      entries = (build!.lib as any)!.entry;
      formats = (build!.lib as any)!.formats as string[];
      packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8')) as Record<string, any>;
    },
    async generateBundle(options) {
      if (isGenerated || !formats.length) return;
      if (!options.dir || !packageJson) throw new Error('package.json not found');

      const { scripts: _a, devDependencies: _b, overrides: _c, ...pkg } = packageJson;
      pkg.sideEffects = ['**/*.css'];
      pkg.files = ['*']
      pkg.main = 'index.cjs';
      pkg.module = 'index.js';
      pkg.types = 'types.d.ts';

      pkg.exports = {
        './package.json': './package.json',
        '.': attachExportsPkg({}, 'index', formats),
        './theme/*.css': './theme/*.css',
      };

      const names = Object.keys(entries).filter(i => i !== 'index' && !i.startsWith('theme'));

      for (const name of names) {
        if (name in pkg.exports) {
          this.warn(`This names "${name}" already in use`);
          continue;
        }
        const exportName = name.replace(/\/?index/, '');
        pkg.exports[`./${exportName}`] = attachExportsPkg({}, name, formats);
      }

      const source = JSON.stringify(pkg, null, '  ');
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        originalFileName: path.join(options.dir, 'package.json'),
        source,
      });
      isGenerated = true;
    },
  }
}

/**
 * Add exports fields to package.json file
 * @param target
 * @param filename
 * @param formats
 */
function attachExportsPkg(target: Record<string, any>, filename: string, formats: string[]) {
  target['types'] = `./${filename}.d.ts`;
  if (formats.includes('es')) {
    target['import'] = `./${filename}.js`;
  }
  if (formats.includes('cjs')) {
    target['require'] = `./${filename}.cjs`;
  }
  target['default'] = `./${filename}.js`;
  return target;
}