// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Injectable, LoggerService } from '@nestjs/common';
import { RequestContext } from '@nestjs/microservices';
import { TokenResponse } from 'auth0';
import got, { Got, Headers, Method } from 'got';

import { CacheService } from './cache.service';

@Injectable()
export class HttpClientService {
  public accessToken: string = '';
  public gotInstance: Got;

  public constructor(private cacheService: CacheService, private loggerService: LoggerService) {
    this.gotInstance = got.extend({
      prefixUrl: process.env.API_HOST_URL,
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /**
   * request -- Makes a request to an external API
   * @param req Original request from client
   * @param method HTTP method of request to be made
   * @param url URL of request to be made
   * @param params Query parameters
   * @param data Body of request
   * @param extraHeaders Extra headers to be added to request
   * @returns
   */
  public request<T>(req: RequestContext, method: Method, url: string, params?: Record<string, any>, data?: any, extraHeaders?: Headers) {
    if (process.env.AWS_EXECUTION_ENV) {
      this.loggerService.log({ [`${method}`]: url, params, data });
    } else {
      this.loggerService.log(`${method}: ${url}`);
    }

    return this.gotInstance<T>(url, {
      method,
      headers: {
        ...req.context?.headers,
        ...extraHeaders
      },
      searchParams: params,
      json: data
    });
  }

  /**
   * getAuth0Token -- Returns Auth0 Token M2M Token
   * @returns OAuth M2M Token
   */
  public async getAuth0Token(): Promise<string> {
    const token = await this.cacheService.getCache<string>('auth0_token');
    if (token) {
      return token;
    }

    return this.generateToken();
  }

  /**
   * generateToken -- Generates Auth0 Token
   * @returns OAuth M2M Token
   */
  private async generateToken(): Promise<string> {
    this.loggerService.log('Generating Token...');

    const response = () =>
      got<TokenResponse>(process.env.AUTH0_ISSUER + 'oauth/token', {
        method: 'POST',
        headers: {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        json: {
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET
        }
      });

    const tokenRes = await this.cacheService.getCacheWithRevalidate('auth0_token', response, 60 * 60 * 12);

    if (tokenRes.statusCode === 200 && tokenRes.body?.access_token) {
      return tokenRes.body.access_token;
    }

    this.loggerService.error(tokenRes);
    throw new Error('Unable to generate token');
  }
}
