import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger.service';

async function bootstrap() {
  const logger = new AppLogger();

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useLogger(logger);

  // Versionamiento por URI: /v1/*
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);

  const url = await app.getUrl();
  logger.log(`Aplicación iniciada en ${url}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  // Fallback si hay error temprano
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
