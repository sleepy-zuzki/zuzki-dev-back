import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(
      (() => {
        const getString = (key: string, def: string) => process.env[key] ?? def;
        const getNumber = (key: string, def: number) => {
          const v = process.env[key];
          if (v === undefined) return def;
          const n = Number(v);
          return Number.isFinite(n) ? n : def;
        };
        const getBoolean = (key: string, def: boolean) => {
          const v = process.env[key];
          if (v === undefined) return def;
          const s = v.toLowerCase();
          return ['true', '1', 'yes', 'y', 'on'].includes(s);
        };
        const resolveSsl = (): boolean | { rejectUnauthorized: boolean } => {
          const raw = process.env['POSTGRES_SSL'];
          const rau = process.env['POSTGRES_SSL_REJECT_UNAUTHORIZED'];
          const enabled = raw
            ? ['true', '1', 'yes', 'require', 'on'].includes(raw.toLowerCase())
            : false;
          if (!enabled) return false;
          if (rau === undefined) return true;
          const rejectUnauthorized = !['false', '0', 'no', 'off'].includes(
            rau.toLowerCase(),
          );
          return { rejectUnauthorized };
        };

        const sslValue = resolveSsl();

        const host = getString('POSTGRES_HOST', 'localhost');
        const port = getNumber('POSTGRES_PORT', 5432);
        const username = getString('POSTGRES_USER', 'postgres');
        const password = getString('POSTGRES_PASSWORD', 'postgres');
        const database = getString('POSTGRES_DB', 'postgres');
        const schema = 'public';
        const synchronize = getBoolean('TYPEORM_SYNC', false);
        const logging = getBoolean('TYPEORM_LOGGING', false);
        const poolMode = getString('POSTGRES_POOL_MODE', 'session');

        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          schema,
          autoLoadEntities: true,
          synchronize,
          logging,
          ssl: sslValue,
          extra: {
            poolMode,
            max: 5,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
          },
          retryAttempts: 3,
          retryDelay: 2000,
          logger: 'advanced-console',
        };
        return options;
      })(),
    ),
  ],
})
export class DatabaseModule {}
