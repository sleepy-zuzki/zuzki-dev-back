import { registerAs } from '@nestjs/config';

import type { CacheConfig } from '@infra/config/types';

export const CACHE_CONFIG = 'cache';

export default registerAs(
  CACHE_CONFIG,
  (): CacheConfig => ({
    ttl: parseInt(process.env.CACHE_TTL || '', 10) || 5,
    max: parseInt(process.env.CACHE_MAX || '', 10) || 100,
  }),
);
