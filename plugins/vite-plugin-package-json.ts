import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';

export default function packageJsonGen(): Plugin {
  const config = {
    entries: {} as Record<string, string>,
    formats: [] as string[],
    outDir: 'dist',
  }

  function addFormats(obj: Record<string, any>, entry: string) {
    obj['types'] = `./${entry}.d.ts`;
    if (config.formats.includes('es')) {
      obj['import'] = `./${entry}.js`;
    }
    if (config.formats.includes('cjs')) {
      obj['require'] = `./${entry}.cjs`;
    }
    obj['default'] = `./${entry}.js`;
    return obj;
  }

  return {
    name: 'package-json-gen',
    apply: 'build',
    enforce: 'post',
    config({ build }) {
      config.entries = (build!.lib as any)!.entry;
      config.formats = (build!.lib as any)!.formats as string[];
      config.outDir = build!.outDir ?? '';
    },
    async buildEnd() {
      const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8')) as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { scripts, devDependencies, overrides, ...pkg } = packageJson;

      pkg.sideEffects = ['**/*.css'];
      pkg.files = ['*']
      pkg.main = 'index.cjs';
      pkg.module = 'index.js';
      pkg.types = 'types.d.ts';

      pkg.exports = {
        './package.json': './package.json',
        '.': addFormats({}, 'index'),
        './theme/*.css': './theme/*.css',
      };

      const names = Object.keys(config.entries).filter(i => !['index', 'styles'].includes(i) && !i.startsWith('themes'));

      for (let name of names) {
        if (name in pkg.exports) {
          this.warn(`This names "${name}" already in use`);
          continue;
        }
        name = name.replace(/\/?index/, '');
        pkg.exports[`./${name}`] = addFormats({}, name);
      }

      await fs.writeFile(path.resolve(config.outDir, 'package.json'), JSON.stringify(pkg, null, '  '), 'utf8');

      await fs.cp('README.md', path.resolve(config.outDir, 'README.md'));
    }
  }
}