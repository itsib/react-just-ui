import { ApiModel, ApiPackage } from '@microsoft/api-extractor-model';

const apiModel: ApiModel = new ApiModel();
const apiPackage: ApiPackage = apiModel.loadPackage('temp/index.api.json');

async function run() {
  console.log(apiPackage);
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });