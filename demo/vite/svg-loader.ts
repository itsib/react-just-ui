import { PluginOption } from 'vite'
import { readFile } from 'node:fs/promises';

export interface SvgLoaderConfig {
  defaultImport?: string;
}

export function svgLoader(options: SvgLoaderConfig = {}) {
  const { defaultImport } = options;

  const svgRegex = /\.svg$/

  return {
    name: 'svg-loader',
    enforce: 'pre',

    async load (id: string) {
      if (!id.match(svgRegex)) {
        return
      }

      const [path, query] = id.split('?', 2)

      const importType = query || defaultImport

      if (importType === 'url') {
        return // Use default svg loader
      }

      let svg

      try {
        svg = await readFile(path, 'utf-8')
      } catch (ex) {
        console.error('\n', `${id} couldn't be loaded by vite-svg-loader, fallback to default loader`)
        return
      }
      return `export default 'data:image/svg+xml;base64,' + btoa(${JSON.stringify(svg)})`;
    }
  } as PluginOption;
}