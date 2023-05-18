// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const environment = {
  production: true,
  environment: 'dev',
  apiURL: 'https://insights-bff.dev.platform.linuxfoundation.org/api',
  lfxHeader: 'https://cdn.dev.platform.linuxfoundation.org',
  myProfileURL: 'https://myprofile.dev.platform.linuxfoundation.org/',
  linuxFoundationSFID: 'a0941000002wBz9AAE',
  cubejsGraphqlAPI: '"https://jade-trout.aws-us-west-2-t-11709.cubecloudapp.dev/cubejs-api/graphql',
  cubejs: {
    playgroundUrl: 'https://lfx-dev.cubecloud.dev/deployments/20/playground',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODI0NDAwNTl9.Ckr330VEip0YJ7RMXOYEfcp5WUq3bBJm20R2vfCUzgk',
    options: {
      apiUrl: 'https://suitable-cat.aws-us-west-2-t-11709.cubecloudapp.dev/cubejs-api/v1'
    }
  },
  auth0: {
    domain: 'linuxfoundation-dev.auth0.com',
    clientId: 'bYWuMkUoO0wMql5FxT83MdKSgRgTEcK8',
    redirectUrl: `${window.location.origin}/auth`,
    audience: 'https://api-gw.dev.platform.linuxfoundation.org/'
  }
};
