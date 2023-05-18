// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { CacheModule, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from '@services/cache.service';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { InsightsModule } from './modules/insights/insights.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      // Ignore health check on production
      exclude: process.env.ENV !== 'production' ? [] : [{ method: RequestMethod.ALL, path: 'api/health' }],
      pinoHttp: {
        name: 'InsightsV3', // Prefix all logs with this name
        level: process.env.ENV !== 'production' ? 'debug' : 'info', // Set the level of logs
        transport: process.env.ENV !== 'production' ? { target: 'pino-pretty' } : undefined, // Pretty print logs in development
        autoLogging: true // Automatically log all requests
      }
    }),
    ConfigModule.forRoot({
      envFilePath: `.env` // Load environment variables from .env file
    }),
    CacheModule.registerAsync({
      isGlobal: true, // Make cache service available to all modules
      useFactory: async () => ({
        store: await redisStore({ url: `redis://${process.env.REDIS_HOST}` }) // Use Redis as cache store
      })
    }),
    InsightsModule // Import Insights module
  ],
  controllers: [AppController],
  providers: [CacheService]
})
export class AppModule {}
