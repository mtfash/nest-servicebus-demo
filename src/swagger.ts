import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initializeSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);
};
