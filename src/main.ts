import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
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

  // Prefijo global de la API: /api/*
  app.setGlobalPrefix('api');

  // Versionamiento por URI: /api/v1/*
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);

  console.log(`Aplicación iniciada en ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  // Fallback si hay error temprano

  console.error(err);
  process.exit(1);
});
