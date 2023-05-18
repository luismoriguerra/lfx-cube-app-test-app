// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

// INFO: this will be moved to a npm library
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import { environment } from '@environments/environment';
import { setContext } from '@apollo/client/link/context';

const CUBEJS_API_TOKEN = environment.cubejs.token;

const httpLink = createHttpLink({
  uri: environment.cubejsGraphqlAPI
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: CUBEJS_API_TOKEN
  }
}));

export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
