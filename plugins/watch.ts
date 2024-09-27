import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'child_process';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const THEMES_DIR = path.resolve(process.cwd(), 'themes');

const FRAMES = ['⢰', '⣠', '⣄', '⡆', '⠇', '⠋', '⠙', '⠸'];
let current = 0;
function getFrame(): string {
  current = current + 1;
  if (current > (FRAMES.length - 1)) {
    current = 0;
  }
  return FRAMES[current]
}

function build(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    exec('npm run build:lib', (err, stdout, stderr) => {
      if (err) {
        const frames = stdout.split('\n\n').filter(Boolean);
        const message = `${stderr}\n${frames[frames.length - 1]}`

        return reject(message);
      }
      resolve(stderr);
    });
  })
}

function debounce<T>(callback: (value: T) => void, delay: number) {
  let _innerValue: T;
  let _skip = false;

  const _fn = () => {
    callback(_innerValue);
    _skip = false;
  };

  return (v: T) => {
    _innerValue = v;
    if (!_skip) {
      _skip = true;
      setTimeout(_fn, delay);
    }
  };
}

function clear() {
  process.stdout.write('\x1Bc');
}

function buildProcess() {
  const interval = setInterval(() => {
    clear();
    process.stdout.write(`\x1b[0;96m${getFrame()}\x1b[0m \x1b[0;93mBuilding...\x1b[0m`);
  }, 100);

  return (error?: Error | string) => {
    clearInterval(interval);

    if (typeof error === 'string' && !!error.trim()) {
      const lines = error.split('\n').map(line => {
        if (line.includes('[WARNING]')) {
          return line.replace(/^(.+\[WARNING])/, '\x1b[0;93m$1\x1b[0m \x1b[0;33m') + '\x1b[0m';
        } else if (/^(\[[\w:]+])/.test(line)) {
          return line.replace(/^(\[[\w:]+])/, '\x1b[0;93m$1\x1b[0m \x1b[0;33m') + '\x1b[0m';
        } else if (line.includes('warning')) {
          return `\x1b[0;33m${line}\x1b[0m`;
        } else {
          const output: string[] = [];
          const numbersFound = /^(?:\s+)?\d*\s+[│|╵|]/.exec(line);
          if (numbersFound) {
            const numbers = line.slice(0, numbersFound[0].length + numbersFound.index);
            output.push(`\x1b[2;37m${numbers}\x1b[0m`);
            line = line.slice(numbersFound[0].length + numbersFound.index);
          }

          const underlineFound = /\^+/.exec(line);
          if (underlineFound) {
            const underline = line.slice(0, underlineFound[0].length + underlineFound.index);
            line = line.slice(underlineFound[0].length + underlineFound.index);

            output.push(`\x1b[0;31m${underline}\x1b[0m${line}`);
          } else {
            output.push(`\x1b[0;37m${line}\x1b[0m`);
          }

          return output.join('');
        }

      })
      clear();
      process.stdout.write(lines.join('\n') + '\n\n\x1b[0;93m⚠ Build with warnings\x1b[0m');
    } else if (error) {
      clear();
      process.stdout.write(`\x1b[0;91m✘ Build error, wait changes.\x1b[0m\n${error}\n`);
    } else {
      clear();
      process.stdout.write('\x1b[0;92m✔ Build success, waiting changes.\x1b[0m');
    }
  }
}

async function run() {
  const onFinish = buildProcess();
  await build().then(onFinish).catch(onFinish);

  const run = debounce(() => {
    const onFinish = buildProcess();
    build().then(onFinish).catch(onFinish);
  }, 100);

  fs.watch(SRC_DIR, { recursive: true }, async () => run(1));
  fs.watch(THEMES_DIR, { recursive: true }, async () => run(1));
}

run().catch(console.error);