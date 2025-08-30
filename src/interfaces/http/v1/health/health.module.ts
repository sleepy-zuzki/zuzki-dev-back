import { Module } from '@nestjs/common';

import { HealthApplicationModule } from '@application/health/health.application.module';

import { HealthController } from './health.controller';

@Module({
  imports: [HealthApplicationModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
