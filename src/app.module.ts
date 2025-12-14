import { randomUUID } from 'node:crypto';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { HealthModule } from '@features/health/health.module';
import { DatabaseModule } from '@shared/database/database.module';
// Legacy Auth import
import { AuthModule } from '@features/auth/auth.module';
import { V1Module } from './v1.module';
import { MetricsModule } from '@metrics/metrics.module';

import { CatalogModule } from '@features/catalog/catalog.module';
import { PortfolioModule } from '@features/portfolio/portfolio.module';
import { UsersModule } from '@features/users/users.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ||
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        genReqId(req: IncomingMessage, res: ServerResponse): string {
          const header = (req.headers['x-request-id'] as string) || undefined;
          const id = header || randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },
        customProps(req: IncomingMessage) {
          const idRaw = (req as IncomingMessage & { id?: string | number }).id;
          return {
            requestId:
              typeof idRaw === 'string'
                ? idRaw
                : typeof idRaw === 'number'
                  ? String(idRaw)
                  : undefined,
          };
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                singleLine: false,
              },
            }
            : undefined,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.CACHE_TTL ?? 5), // segundos
      max: Number(process.env.CACHE_MAX ?? 100),
    }),
    DatabaseModule,
    // Features
    CatalogModule,
    PortfolioModule,
    UsersModule, // Migrated
    // Legacy Applications
    HealthModule,
    AuthModule,
    MetricsModule,
    V1Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class AppModule { }
