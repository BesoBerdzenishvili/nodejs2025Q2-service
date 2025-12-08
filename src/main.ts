import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { join } from 'path';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const yamlPath = join(process.cwd(), 'doc', 'api.yaml');
  const yamlFile = readFileSync(yamlPath, 'utf8');
  const document = load(yamlFile);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    '/doc',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: 'API Documentation',
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap();
