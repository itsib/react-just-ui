const { readdir, rm } = require('node:fs/promises');
const { resolve } = require('node:path');

const distDir = resolve(__dirname, '..', 'dist');

async function clean() {
  const dirents = await readdir(distDir, { encoding: 'utf8', recursive: false, withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.isDirectory() && dirent.name !== 'css') {
      await rm(resolve(dirent.parentPath, dirent.name), { recursive: true, force: true });
    }
  }
}

clean().catch(error => {
  console.error(error);
  process.exit(1);
})