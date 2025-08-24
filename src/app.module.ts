import { Module } from '@nestjs/common';
import { V1Module } from './modules/v1/v1.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ||
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        genReqId(req, res) {
          const header = (req.headers['x-request-id'] as string) || undefined;
          const id = header || randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },
        customProps(req) {
          return { requestId: (req as any).id };
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
    DatabaseModule,
    AuthModule,
    MetricsModule,
    V1Module,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
