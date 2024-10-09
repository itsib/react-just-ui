import replace from '@rollup/plugin-replace';

export interface ViteReplacerOptions {
  prefix?: string;
}

export default function viteReplacer(options: ViteReplacerOptions) {
  const { prefix = 'jj' } = options;
  const plugin = replace({
    prefix: prefix,
    preventAssignment: true,
    delimiters: ['__', '__']
  });

  return {
    ...plugin,
    name: 'vite:replacer',
  }
}