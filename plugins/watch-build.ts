import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'child_process';

const SRC_DIR = path.resolve(process.cwd(), 'src');

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

async function run() {
  const abort = new AbortController();

  const runBuild = debounce(event => {
    if (event) {
      console.log(`\x1b[0;33m🗘 Changes detect. Run re-build...\x1b[0m`);
    }

    const proc = spawn('npm', ['run', 'build:lib'], { stdio: 'inherit', cwd: process.cwd(), signal: abort.signal });

    proc.once('close', () => {
      console.log(`\n\x1b[0;33m⏲  Wait changes\x1b[0m`);
    });
  }, 100);

  runBuild(null);
  fs.watch(SRC_DIR, { recursive: true, signal: abort.signal }).on('change', runBuild);

  process.on('exit', () => {
    abort.abort();
  });
}

run().catch(console.error);