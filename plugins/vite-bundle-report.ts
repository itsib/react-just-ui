import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'util';
import { gzip as _gzip } from 'node:zlib';
import { formatSize } from './utils';
const gzip = promisify(_gzip);

export interface ReportConfig {
  filename?: string;
  outputPath?: string;
  enableGzip?: boolean;
  extensions?: string[];
}

export default function bundleReport(config?: ReportConfig): Plugin {
  // eslint-disable-next-line prefer-const
  let { extensions = ['js', 'css', 'cjs'], filename = 'report.json', enableGzip, outputPath } = config || {};

  if (!filename) {
    throw new Error('FIle name shouldn\'t be empty');
  }

  const initReport: { [ext: string]: number } = extensions.reduce((acc, ext) => ({ ...acc, [ext]: 0 }), {});
  let distPath = path.resolve(import.meta.dirname, '../dist');

  if (outputPath) {
    outputPath = path.isAbsolute(outputPath) ? outputPath : path.resolve(import.meta.dirname, '..', outputPath);
  } else {
    outputPath = distPath;
  }

  return {
    name: 'vite:bundle-report',
    apply: 'build',
    enforce: 'post',
    writeBundle(options) {
      distPath = options.dir || distPath;
    },
    async closeBundle() {
      const files = await fs.readdir(distPath, { recursive: true, withFileTypes: true });

      const total: { [ext: string]: number } = { ...initReport };
      const totalGzip: { [ext: string]: number } = { ...initReport };
      const modules: { [module: string]: { [ext: string]: number } } = {};
      const modulesGzip: { [module: string]: { [ext: string]: number } } = {};

      for (const file of files) {
        if (!file.isFile() || file.name.endsWith('.d.ts')) continue;

        const ext = path.extname(file.name).slice(1);
        if (!extensions.includes(ext)) continue;

        const fullPath = path.resolve(file.parentPath, file.name);
        const moduleFilename = path.relative(distPath, fullPath);
        const moduleName = moduleFilename.replace(`.${ext}`, '').replace('/index', '');
        const fileStat = await fs.stat(path.resolve(file.parentPath, file.name));

        const moduleReport = modules[moduleName] || {...initReport};
        moduleReport[ext] += fileStat.size;
        modules[moduleName] = moduleReport;

        total[ext] += fileStat.size;

        if (enableGzip) {
          const content = await fs.readFile(fullPath);
          const size = (await gzip(content, {  })).length;

          const moduleGzipReport = modulesGzip[moduleName] || {...initReport};
          moduleGzipReport[ext] += size;
          modulesGzip[moduleName] = moduleGzipReport;

          totalGzip[ext] += size;
        }
      }

      const fullReport = {
        total: Object.keys(total).reduce((acc, key) => ({ ...acc, [key]: [total[key], totalGzip[key]] }), {}),
        modules: {},
      };

      fullReport.modules = Object.keys(modules).reduce((acc, name) => {
        const module = modules[name];
        const moduleGzip = modulesGzip[name];
        return {
          ...acc,
          [name]: Object.keys(module).reduce((mod, key) => ({ ...mod, [key]: [module[key], moduleGzip[key]] }), {})
        };
      }, {})

      const output = path.resolve(outputPath, filename);
      const report = JSON.stringify(fullReport, undefined, 2);
      await fs.writeFile(output, report, 'utf8');

      console.log('\x1b[0;32mTotal:\x1b[0m');
      for (const ext of extensions) {
        console.log(
          '\x1b[0;94m%s\x1b[0m \x1b[1;37m%s\x1b[0m \x1b[0;37m| gzip: %s\x1b[0m',
          ext.padStart(4),
          formatSize(total[ext]).padStart(16),
          formatSize(totalGzip[ext]),
        )
      }
    },
  }
}