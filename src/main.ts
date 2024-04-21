import { NestFactory } from '@nestjs/core';
import {
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
  VersioningType,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { config } from 'dotenv';

// this is only for localhost to make sure .env file is read
config();

import { initializeSwagger } from './swagger';
import { AppModule } from './app.module';
import { EventHubsConsumerService } from './events/eventhubs-consumer.service';
import { SBusLikesConsumer } from './notifications/sbus-likes-consumer.service';
import { SBusCommentsConsumer } from './notifications/sbus-comments-consumer.service';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  initializeSwagger(app);

  // Event Hub Data Ingestion (Objective 2)
  const eventhubsConsumer = app.get(EventHubsConsumerService);
  eventhubsConsumer.start();

  // Service Bus Consumer for post-likes Queue (Objective 3)
  const postLikesConsumer = app.get(SBusLikesConsumer);
  await postLikesConsumer.start();

  // Service Bus Consumer for post-comments Queue (Objective 3)
  const postCommentsConsumer = app.get(SBusCommentsConsumer);
  await postCommentsConsumer.start();

  await app.listen(3000);
}

bootstrap();
