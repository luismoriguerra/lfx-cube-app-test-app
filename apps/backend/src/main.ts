// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const allowedOrigins = (): string | string[] => {
    // Note, do NOT use `true`. (Using origin reflection instead of "*" for any
    // origins is insecure and incompatible with CORS standards).
    const anyOrigin = '*';

    if (!process.env.ENV) {
      return anyOrigin;
    }

    switch (process.env.ENV) {
      case 'development':
        return anyOrigin;
      case 'production':
        return ['insights.v3.lfx.linuxfoundation.org'];
      default:
        return anyOrigin;
    }
  };

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: {
      origin: allowedOrigins(),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-datadog-trace-id',
        'x-datadog-parent-id',
        'x-datadog-origin',
        'x-datadog-sampling-priority',
        'x-datadog-sampled'
      ],
      maxAge: 3600
    }
  });

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder().setTitle('Insights API').setDescription('The Insights V3 API').setVersion('1.0').addTag('LFX Insights').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT as string, 10) || 8000);
}
bootstrap();
