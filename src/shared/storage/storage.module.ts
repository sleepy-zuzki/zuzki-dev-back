import { Module } from '@nestjs/common';
import { ConfigurationModule } from '@config/configuration.module';
import { ConfigurationService } from '@config/configuration.service';
import { CLOUDFLARE_R2_CONFIG } from '@shared/config/configs/cloudflare-r2.config';
import type { CloudflareR2Config } from '@shared/config/types';

import { CloudflareR2StorageAdapter } from './cloudflare-r2.storage.adapter';

@Module({
  imports: [ConfigurationModule],
  providers: [
    {
      provide: CLOUDFLARE_R2_CONFIG,
      useFactory: (cfg: ConfigurationService): CloudflareR2Config => ({
        endpoint: cfg.getString('CLOUDFLARE_R2_ENDPOINT', ''),
        accessKeyId: cfg.getString('CLOUDFLARE_R2_ACCESS_KEY_ID', ''),
        secretAccessKey: cfg.getString('CLOUDFLARE_R2_SECRET_ACCESS_KEY', ''),
        bucket: cfg.getString('CLOUDFLARE_R2_BUCKET', ''),
        publicUrl: cfg.getString('CLOUDFLARE_R2_PUBLIC_URL', ''),
      }),
      inject: [ConfigurationService],
    },
    CloudflareR2StorageAdapter,
  ],
  exports: [CloudflareR2StorageAdapter],
})
export class SharedStorageModule { }
