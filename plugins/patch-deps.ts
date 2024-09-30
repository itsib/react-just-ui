import fs from 'node:fs/promises';
import { resolve } from 'node:path';

interface ConfigReplacements {
  pattern: RegExp;
  replace: string;
}

interface Config {
  packages: string[];
  filenames: string[];
  comment: string;
  replace: ConfigReplacements;
}

interface PatchResult {
  filename: string;
  pkg: string;
}

const ROOT_PATH = resolve(import.meta.dirname, '../node_modules');

const CONFIG: Config[] = [
  {
    packages: ['@typescript-eslint/typescript-estree'],
    filenames: ['warnAboutTSVersion.js'],
    comment: 'Warning about unsupported ts version',
    replace:  {
      pattern: /let\swarnedAboutTSVersion\s=\sfalse;/g,
      replace: 'let warnedAboutTSVersion = true;',
    }
  },
  {
    packages: ['@metamask/sdk-install-modal-web', '@metamask/sdk', 'react-dom'],
    filenames: ['react-dom.development.js', 'metamask-sdk.js', 'index.js'],
    comment: 'Warning about dev environment',
    replace:  {
      pattern: /console\.info\(["']%cDownload the React DevTools\s[\w\d\s'+:\/.\-)(=?\\,"]+font-weight:bold["']\)/g,
      replace: '(function(){})()',
    }
  },
];

function isTest() {
  return Boolean(~process.argv.indexOf('--test') || ~process.argv.indexOf('-t'));
}

/**
 * Find a line in the file and replace it with replacer.
 *
 * @param {string} filepath
 * @param {{ pattern:RegExp,replace:string }} replacer
 * @returns {Promise<boolean>}
 */
async function searchAndPatch(filepath: string, replacer: ConfigReplacements): Promise<boolean> {
  const contents = await fs.readFile(filepath, { encoding: 'utf8' });

  replacer.pattern.lastIndex = 0;
  const result = replacer.pattern.exec(contents);
  if (!result) {
    return false;
  }

  const found = result[0];
  let patched = contents.slice(0, result.index);
  patched += replacer.replace;
  patched += contents.slice(result.index + (found.length));

  if (isTest()) {
    console.log('\x1b[0;97mFile: %s\x1b[0m', filepath);
    const start = result.index - 100;
    const end = result.index + found.length + 100;

    console.log('Before:\n\x1b[2;64m\n%s\x1b[0m', contents.slice(start, end));

    console.log('After:\n\x1b[2;64m\n%s\x1b[0m', patched.slice(start, end));

    return false;
  } else {
    await fs.writeFile(filepath, patched, { encoding: 'utf8' });
  }
  return true;
}

/**
 *
 * @param {string} directory
 * @param {(string)[]} filenames
 * @param {{ pattern:RegExp,replace:string }} replace
 * @returns {Promise<Dirent[]>}
 */
async function searchFiles(directory: string, filenames: string[], replace: ConfigReplacements): Promise<string[]> {
  const files = await fs.readdir(directory, { withFileTypes: true, recursive: true, encoding: 'utf8' }).catch(() => []);
  const patched: string[] = [];

  for (const file of files) {
    if (!file.isFile() || !filenames.includes(file.name)) {
      continue;
    }

    const absolute = resolve(file.parentPath, file.name);
    const result = await searchAndPatch(absolute, replace);
    if (!result) {
      continue;
    }

    patched.push(file.name);
  }

  return patched;
}

async function handleConfig({ packages, filenames, replace }: Config): Promise<PatchResult[]> {
  const results: PatchResult[] = [];

  for (const pkg of packages) {
    const pkgPath = resolve(ROOT_PATH, pkg);
    const patchedFilenames = await searchFiles(pkgPath, filenames, replace);
    if (!patchedFilenames.length) {
      continue
    }
    results.push(...patchedFilenames.map(filename => ({ filename, pkg })));
  }

  return results;
}

async function run(_configs: Config[]) {
  console.log(`\n\x1b[0;36mChecking packages to patch vulnerable files\x1b[0m`);
  let isPatched = false;

  for(const _config of _configs) {
    const patched = await handleConfig(_config);
    for (const file of patched) {
      console.log(
        `\x1b[0;32m✔\x1b[0m 📦 \x1b[2;93m%s\x1b[0m 💾 \x1b[2;93m%s\x1b[0m \x1b[2;64m%s\x1b[0m`,
        file.pkg.padEnd(28),
        file.filename.padEnd(28),
        _config.comment,
      );
      isPatched = true;
    }
  }

  if (isPatched) {
    console.log('\x1b[0;32m  Done!\x1b[0m');
  } else {
    console.log('\x1b[0;32m  No files found. It\'s good.\x1b[0m');
  }
}

run(CONFIG)
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

