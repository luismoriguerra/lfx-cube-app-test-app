// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

const { writeFile } = require('fs');
// const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

const targetPath = `./src/environments/environment.datadog.ts`;

// readFile(targetPath, 'utf8', (error: any, data: any) => {
//   console.log(data);
// });

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const environment = {
   datadogAppID: "${process.env.DATADOG_APP_ID}",
   datadogToken: "${process.env.DATADOG_TOKEN}"
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => {
  if (err) {
    // eslint-disable-next-line no-restricted-syntax
    console.log(err);
  }

  // eslint-disable-next-line no-restricted-syntax
  console.log(`Wrote variables to ${targetPath}`);
});
