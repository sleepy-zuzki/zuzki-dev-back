import 'reflect-metadata';
import { VersioningType, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: ['http://localhost:4200', 'https://api.zuzki.dev'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['content-type', 'Authorization'],
    credentials: true,
  });

  // Compresión HTTP
  app.use(
    compression({
      // puedes ajustar el threshold si lo necesitas
    }),
  );

  // Validación y transformación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
      transform: true, // transforma payloads a instancias de DTO
      transformOptions: {
        enableImplicitConversion: true, // convierte tipos primitivos cuando sea posible
      },
    }),
  );

  // Prefijo global de la API: /api
  app.setGlobalPrefix('api');

  // Versionamiento por URI: /api/v1
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  const url = await app.getUrl();
  const logger = new Logger('Bootstrap');
  logger.log(`Aplicación iniciada en ${url}`);
}

bootstrap().catch((err: Error) => {
  // Fallback si hay error temprano
  const logger = new Logger('Bootstrap');
  logger.error('Error al iniciar la aplicación', err?.stack ?? String(err));
  process.exit(1);
});
