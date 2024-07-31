const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SRC_DIR = path.resolve(process.cwd(), 'src');

const FRAMES = ['⢰', '⣠', '⣄', '⡆', '⠇', '⠋', '⠙', '⠸'];
let current = 0;
function getFrame() {
  current = current + 1;
  if (current > (FRAMES.length - 1)) {
    current = 0;
  }
  return FRAMES[current]
}

function build() {
  return new Promise((resolve, reject) => {
    exec('npm run build', (err, stdout) => {
      if (err) {
        const frames = stdout.split('\n\n').filter(Boolean);
        return reject(frames[frames.length - 1]);
      }
      resolve();
    });
  })
}

function debounce(callback, delay) {
  let _innerValue;
  let _skip = false;

  const _fn = () => {
    callback(_innerValue);
    _skip = false;
  };

  return (v) => {
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

  return error => {
    clearInterval(interval);

    if (error) {
      clear();
      process.stdout.write(`\x1b[0;91m✘ Build error, wait changes.\x1b[0m\n\x1b[0;31m${error}\x1b[0m\n`);
    } else {
      clear();
      process.stdout.write('\x1b[0;92m✔ Build success, waiting changes.\x1b[0m');
    }
  }
}

async function start() {
  const onSuccess = buildProcess();
  await build().then(onSuccess).catch(onSuccess);

  const run = debounce(() => {
    const onSuccess = buildProcess();
    build().then(onSuccess).catch(onSuccess);
  }, 100);

  fs.watch(SRC_DIR, { recursive: true }, async () => run(1));
}

start().catch(console.error);