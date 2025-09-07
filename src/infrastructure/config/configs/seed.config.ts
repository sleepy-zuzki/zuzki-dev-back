import { registerAs } from '@nestjs/config';

import type { SeedConfig } from '@infra/config/types';

export const SEED_CONFIG = 'seed';

export default registerAs(
  SEED_CONFIG,
  (): SeedConfig => ({
    allowInProduction: process.env.SEED_ALLOW_IN_PROD === 'true',
  }),
);
