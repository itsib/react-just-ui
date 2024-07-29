const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const SRC_DIR = path.resolve(process.cwd(), 'src');

function build() {
  return new Promise((resolve, reject) => {
    exec('npm run build', (err) => {
      if (err) {
        return reject(err);
      }
      resolve('\x1b[0;92m✔ Rebuild successfully!\x1b[0m');
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

async function start() {
  await build().then(console.log).catch(console.error);

  const run = debounce((file) => {
    console.log(`\x1b[2;37m  File modification detected ❯\x1b[0m \x1b[2;93m${file}\x1b[0m`);

    build().then(console.log).catch(console.error);
  }, 100);

  fs.watch(SRC_DIR, { recursive: true }, async (event, filename) => {
    run(filename);
  });
}

start().catch(console.error);