import { registerAs } from '@nestjs/config';

import type { AppConfig } from '@infra/config/types';

export const APP_CONFIG = 'app';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export default registerAs(
  APP_CONFIG,
  (): AppConfig => ({
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '', 10) || 3000,
    nodeEnv: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Development,
    logLevel: process.env.LOG_LEVEL || 'debug',
  }),
);
