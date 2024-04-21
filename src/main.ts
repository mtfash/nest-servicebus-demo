import { config } from 'dotenv';
config();

import * as appInsights from 'applicationinsights';
import { AzureApplicationInsightsLogger } from 'winston-azure-application-insights';
import { NestFactory } from '@nestjs/core';
import {
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
  VersioningType,
} from '@nestjs/common';

import { useContainer } from 'class-validator';
import { initializeSwagger } from './swagger';
import { AppModule } from './app.module';
import winston from 'winston';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
};

async function bootstrap() {
  appInsights
    .setup()
    .setInternalLogging(true, true)
    .setAutoCollectConsole(true, true)
    .setAutoCollectExceptions(true)
    .setSendLiveMetrics(true)
    .setAutoCollectRequests(true)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectDependencies(true)
    .enableWebInstrumentation(true)
    .start();

  winston.add(
    new AzureApplicationInsightsLogger({
      insights: appInsights,
    }),
  );

  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  initializeSwagger(app);

  await app.listen(3000);
}

bootstrap();
