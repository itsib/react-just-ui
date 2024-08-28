const fs = require('node:fs/promises');
const path = require('node:path');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

const distDir = path.resolve(__dirname, '..', 'dist');

const apiExtractorJsonPath = path.join(__dirname, '..', '/api-extractor.json');

const CONFIG_FILES = [
  {
    input: '<projectFolder>/dist/index.d.ts',
    outputDtsFile: '<projectFolder>/dist/index.d.ts',
    outputJsonPath: '<projectFolder>/demo/public/json/',
  },
  {
    input: '<projectFolder>/dist/validators/index.d.ts',
    outputDtsFile: '<projectFolder>/dist/validators.d.ts',
    outputJsonPath: '<projectFolder>/demo/public/json/',
  },
  {
    input: '<projectFolder>/dist/utils/index.d.ts',
    outputDtsFile: '<projectFolder>/dist/utils.d.ts',
    outputJsonPath: '<projectFolder>/demo/public/json/',
  },
];

function extractApi(config) {
  const { input, outputDtsFile, outputJsonPath } = config;
  const configFile = ExtractorConfig.loadFile(apiExtractorJsonPath);
  const filename = path.basename(outputDtsFile, 'd');
  const fileBaseName = filename.split('.')[0];

  const outputJsonFile = path.join(outputJsonPath, `${fileBaseName}.api.json`);

  const extractorConfig = ExtractorConfig.prepare({
    configObject: {
      ...configFile,
      mainEntryPointFilePath: input,
      apiReport: {
        ...configFile.apiReport,
        reportFileName: `${fileBaseName}`
      },
      dtsRollup: {
        ...configFile.dtsRollup,
        untrimmedFilePath: outputDtsFile,
      },
      docModel: {
        ...configFile.docModel,
        apiJsonFilePath: outputJsonFile,
      }
    },
    configObjectFullPath: path.join(__dirname, '..'), // '<lookup>',
    packageJsonFullPath: path.join(__dirname, '..', 'package.json'),
    projectFolderLookupToken: path.join(__dirname, '..'),
  });

  return Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });
}

async function clean() {
  const dirents = await fs.readdir(distDir, { encoding: 'utf8', recursive: false, withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.isDirectory() && dirent.name !== 'css') {
      await fs.rm(path.resolve(dirent.parentPath, dirent.name), { recursive: true, force: true });
    }
  }
}

function runExtractors() {
  for (let i = 0; i < CONFIG_FILES.length; i++) {
    const result = extractApi(CONFIG_FILES[i]);

    if (result.succeeded) {
      console.log(`\x1b[0;92m✔ API Extractor completed successfully.\x1b[0m`);
    } else {
      console.error(
        `\x1b[0;91m✘ API Extractor completed with ${result.errorCount} errors` +
        ` and ${result.warningCount} warnings\x1b[0m`
      );
      process.exit(1);
    }
  }
}

runExtractors();

clean().catch(console.error);