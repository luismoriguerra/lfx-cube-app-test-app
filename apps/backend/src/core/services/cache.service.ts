// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import { Logger } from 'nestjs-pino';

@Injectable()
export class CacheService {
  public constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache, private loggerService: Logger) {}

  public async setCache(key: string, value: any, ttl: number = 60 * 60 * 6): Promise<void> {
    return this.cacheManager.set(key, value, ttl);
  }

  public async getCache<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  public async deleteCache(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }

  public async getCacheWithRevalidate<T>(key: string, callback: () => Promise<T>, ttl?: number): Promise<T> {
    if (ttl === undefined) {
      ttl = 60 * 6;
    }

    // Convert seconds to milliseconds
    ttl = ttl * 1000;

    const setTTL = () => Promise.resolve(DateTime.now().plus({ seconds: ttl }).toMillis());

    const cacheData = await this.cacheManager.wrap<T>(key, callback, ttl);
    const cacheTTL = await this.cacheManager.wrap<number>(`${key}_ttl`, setTTL, ttl);
    const softExpire = DateTime.now()
      .plus({ seconds: ttl - 300 })
      .toMillis();

    if (cacheTTL < softExpire) {
      this.loggerService.log(`Cache stale, revalidating for key ${key}...`);
      this.deleteCache(`${key}_ttl`);
      this.deleteCache(key);
      this.cacheManager.wrap<T>(key, callback, ttl);
      this.cacheManager.wrap<number>(`${key}_ttl`, setTTL, ttl);
    }

    return cacheData;
  }
}
