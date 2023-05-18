// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environment: 'dev',
  apiURL: 'http://localhost:8000/api',
  lfxHeader: 'https://cdn.dev.platform.linuxfoundation.org',
  myProfileURL: 'https://myprofile.dev.platform.linuxfoundation.org/',
  linuxFoundationSFID: 'a0941000002wBz9AAE',
  // modify with cubejs server url once we have it, currently using local docker
  cubejsGraphqlAPI: 'http://localhost:4000/cubejs-api/graphql',
  cubejs: {
    playgroundUrl: 'http://localhost:4000/#/build',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgyODc3MzYsImV4cCI6MTY3ODM3NDEzNn0.fig3eerzaTDb_7sq-yCxPrsVC5bNjEIXOclW2axIN00',
    options: {
      apiUrl: 'http://localhost:4000/cubejs-api/v1'
    }
  },
  auth0: {
    domain: 'linuxfoundation-dev.auth0.com',
    clientId: 'bYWuMkUoO0wMql5FxT83MdKSgRgTEcK8',
    redirectUrl: `${window.location.origin}/auth`,
    audience: 'https://api-gw.dev.platform.linuxfoundation.org/'
  },
  datadogEnv: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
