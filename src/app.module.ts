import { randomUUID } from 'node:crypto';

import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule, LoggerErrorInterceptor } from 'nestjs-pino';

// Legacy Auth import
import { MetricsModule } from '@metrics/metrics.module';
import { DatabaseModule } from '@shared/database/database.module';

import { V1Module } from './v1.module';

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
        transport: {
          targets: [
            // Console Output (Pretty in Dev)
            ...(process.env.NODE_ENV !== 'production'
              ? [
                  {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      translateTime: 'SYS:standard',
                      singleLine: false,
                    },
                  },
                ]
              : []),
            // File Output: All logs (Daily Rotation)
            {
              target: 'pino-roll',
              options: {
                file: './logs/app/log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                extension: '.log',
              },
            },
            // File Output: Errors only (Daily Rotation)
            {
              target: 'pino-roll',
              level: 'error',
              options: {
                file: './logs/error/log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                extension: '.log',
              },
            },
          ],
        },
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.CACHE_TTL ?? 5), // segundos
      max: Number(process.env.CACHE_MAX ?? 100),
    }),
    DatabaseModule,
    MetricsModule,
    // V1 Features (grouped)
    V1Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
