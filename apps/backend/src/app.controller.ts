// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServiceHealth } from 'lfx-insights';

@ApiTags('Health')
@Controller('api')
export class AppController {
  public constructor() {}

  @ApiOkResponse({
    status: 200,
    description: 'Get the health of the service'
  })
  @Get('health')
  public async getHealth(): Promise<ServiceHealth> {
    return { DateTime: new Date().toISOString(), Status: 'OK' };
  }
}
