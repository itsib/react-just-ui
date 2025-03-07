import { Importer, ImporterResult } from 'sass-embedded';

/**
 * Format filesize in kilobytes
 * @param size
 */
export function formatSize(size: number): string {
  return `${(size / 1000).toFixed(2)} kB`;
}

export function isBuffer(obj: any): obj is Buffer {
  return obj &&
    obj.constructor &&
    (typeof obj.constructor.isBuffer === 'function') &&
    obj.constructor.isBuffer(obj);
}

export function flatten<T, R>(target: T, opts: Record<string, any> = {}): R {
  const output = {} as R;

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || ((key: string) => key);

  function step(object: any, prev?: string, currentDepth?: number) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function (key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      );

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (!isarray && !isBuffer(value) && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1);
      }

      (output as any)[newKey] = value;
    });
  }

  step(target);

  return output;
}

export function getPrefixImporter(prefix = ''): Importer<'sync'> {
  return {
    canonicalize: (url: string): any => url.startsWith('config:prefix') ? new URL(url) : null,
    load: (_: URL) => ({
      contents: `$prefix: "${prefix}"`,
      syntax: 'scss'
    } as ImporterResult)
  }
}