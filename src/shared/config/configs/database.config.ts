import { registerAs } from '@nestjs/config';

import type { DatabaseConfig } from '@shared/config/types';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing critical environment variable: ${key}`);
  }
  return value;
}

export const DATABASE_CONFIG = 'database';

export default registerAs(
  DATABASE_CONFIG,
  (): DatabaseConfig => ({
    host: getEnv('POSTGRES_HOST'),
    port: parseInt(process.env.POSTGRES_PORT || '', 10) || 5432,
    user: getEnv('POSTGRES_USER'),
    pass: getEnv('POSTGRES_PASSWORD'),
    dbName: getEnv('POSTGRES_DB'),
    schema: process.env.POSTGRES_SCHEMA || 'portfolio',
    sync: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    ssl:
      process.env.POSTGRES_SSL === 'require'
        ? 'require'
        : process.env.POSTGRES_SSL === 'true' ||
          process.env.POSTGRES_SSL === '1',
  }),
);
