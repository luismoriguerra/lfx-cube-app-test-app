// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InsightsService } from '@services/insights.service';

@ApiTags('LFX Insights')
@Controller('api/insights')
export class InsightsController {
  public constructor(private insightsService: InsightsService) {}

  @Get('hi')
  public getHi(): string {
    return 'hi';
  }
}
