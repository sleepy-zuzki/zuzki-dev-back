import { randomUUID } from 'node:crypto';

import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { CatalogApplicationModule } from '@application/catalog/catalog.application.module';
import { HealthApplicationModule } from '@application/health/health.application.module';
import { PortfolioApplicationModule } from '@application/portfolio/portfolio.application.module';
import { UsersApplicationModule } from '@application/users/users.application.module';
import { DatabaseModule } from '@infra/database/database.module';
import { AuthModule } from '@interfaces/http/v1/auth/auth.module';
import { V1Module } from '@interfaces/http/v1/v1.module';
import { MetricsModule } from '@metrics/metrics.module';

import type { IncomingMessage, ServerResponse } from 'node:http';

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
    // Application root: usa Application Modules que encapsulan la composición
    UsersApplicationModule,
    CatalogApplicationModule,
    PortfolioApplicationModule,
    HealthApplicationModule,
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
export class AppModule {}
