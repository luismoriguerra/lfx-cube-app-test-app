// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Module } from '@nestjs/common';
import { CacheService } from '@services/cache.service';
import { InsightsService } from '@services/insights.service';

import { InsightsController } from './insights.controller';

@Module({
  controllers: [InsightsController],
  providers: [InsightsService, CacheService]
})
export class InsightsModule {}
