import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
  VersioningType,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { initializeSwagger } from './swagger';

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

  await app.listen(3000);
}

bootstrap();
