import { registerAs } from '@nestjs/config';

import type { CloudflareR2Config } from '@infra/config/types';

export const CLOUDFLARE_R2_CONFIG = 'cloudflare-r2';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing critical environment variable: ${key}`);
  }
  return value;
}

export default registerAs(
  CLOUDFLARE_R2_CONFIG,
  (): CloudflareR2Config => ({
    endpoint: getEnv('CLOUDFLARE_R2_ENDPOINT'),
    accessKeyId: getEnv('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    bucket: getEnv('CLOUDFLARE_R2_BUCKET'),
    publicUrl: getEnv('CLOUDFLARE_R2_PUBLIC_URL'),
  }),
);
