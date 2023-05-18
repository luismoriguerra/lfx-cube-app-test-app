// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const environment = {
  production: true,
  environment: 'prod',
  apiURL: 'https://insights-bff.platform.linuxfoundation.org/production/api',
  lfxHeader: 'https://cdn.platform.linuxfoundation.org',
  myProfileURL: 'https://myprofile.lfx.platform.linuxfoundation.org/',
  linuxFoundationSFID: 'a0941000002wBz9AAE',
  cubejsGraphqlAPI: 'https://jade-trout.aws-us-west-2-t-11709.cubecloudapp.dev/cubejs-api/graphql',
  cubejs: {
    playgroundUrl: 'https://lfx-dev.cubecloud.dev/deployments/25/playground',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODIwMTk0NjZ9.Zj9QVrylEogrycbSSxp1JmaISJJEpzjRsHGUelRBVkU',
    options: {
      apiUrl: 'https://jade-trout.aws-us-west-2-t-11709.cubecloudapp.dev/cubejs-api/v1'
    }
  },
  auth0: {
    domain: 'sso.linuxfoundation.org',
    clientId: 'YpsGIh8W6lU1tB8270y1u3e2B1nAcEUR',
    redirectUrl: `${window.location.origin}`,
    audience: 'https://api-gw.platform.linuxfoundation.org/'
  },
  datadogEnv: 'development'
};
