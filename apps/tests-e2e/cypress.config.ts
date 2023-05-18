// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  video: true,
  videoUploadOnPasses: false,
  trashAssetsBeforeRuns: true,
  defaultCommandTimeout: 20000,
  requestTimeout: 30000,
  retries: 2,
  projectId: "qie19o",
  e2e: {
    setupNodeEvents(on, config) {
      // require('./cypress/plugins/index.ts')(on, config);

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "electron") {
          launchOptions.args.push("--disable-http-cache");
        }
      });
    },
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    retries: {
      runMode: 3,
    },
  },
});
