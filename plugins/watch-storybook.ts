import { spawn } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const DELAY = 2000;
const ABORT = new AbortController();

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

function run() {
  console.log('\x1b[0;33mRun storybook\x1b[0m');

  const childProcess = spawn('storybook', ['dev', '--exact-port', '--port', '6060', '--disable-telemetry', '--no-open'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    signal: ABORT.signal,
    shell: false,
  });

  const restartStorybook = debounce(() => {
    console.log('\x1b[0;33mTerminate storybook\x1b[0m');

    childProcess?.kill('SIGTERM');

    setTimeout(run, DELAY);
  }, 200);

  const watcher = fs.watch(DIST_DIR, { recursive: true, signal: ABORT.signal });

  watcher.once('change', () => {
    restartStorybook(null);
  });
}

process.on('exit', () => {
  ABORT.abort();
});

run();