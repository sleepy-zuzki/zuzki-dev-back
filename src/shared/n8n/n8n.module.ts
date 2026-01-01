import { Module } from '@nestjs/common';

import { ConfigurationModule } from '@config/configuration.module';

import { N8nService } from './n8n.service';

@Module({
  imports: [ConfigurationModule],
  providers: [N8nService],
  exports: [N8nService],
})
export class N8nModule {}
