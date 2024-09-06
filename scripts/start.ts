import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'child_process';

const SRC_DIR = path.resolve(process.cwd(), 'src');

const FRAMES = ['⢰', '⣠', '⣄', '⡆', '⠇', '⠋', '⠙', '⠸'];
let current = 0;
function getFrame(): string {
  current = current + 1;
  if (current > (FRAMES.length - 1)) {
    current = 0;
  }
  return FRAMES[current]
}

function build(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    exec('npm run build:lib', (err, stdout, stderr) => {
      if (err) {
        const frames = stdout.split('\n\n').filter(Boolean);
        const message = `${stderr}\n${frames[frames.length - 1]}`

        return reject(message);
      }
      resolve();
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

  return (error?: Error | void) => {
    clearInterval(interval);

    if (error) {
      clear();
      process.stdout.write(`\x1b[0;91m✘ Build error, wait changes.\x1b[0m\n${error}\n`);
    } else {
      clear();
      process.stdout.write('\x1b[0;92m✔ Build success, waiting changes.\x1b[0m');
    }
  }
}

async function run() {
  const onSuccess = buildProcess();
  await build().then(onSuccess).catch(onSuccess);

  const run = debounce(() => {
    const onSuccess = buildProcess();
    build().then(onSuccess).catch(onSuccess);
  }, 100);

  fs.watch(SRC_DIR, { recursive: true }, async () => run(1));
}

run().catch(console.error);