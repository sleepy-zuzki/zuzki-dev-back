import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  // Prefijo global de la API: /api/*
  app.setGlobalPrefix('api');

  // Versionamiento por URI: /api/v1/*
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  const url = await app.getUrl();
  logger.log(`Aplicación iniciada en ${url}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  // Fallback si hay error temprano
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
