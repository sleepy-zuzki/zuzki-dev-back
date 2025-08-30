import { Module } from '@nestjs/common';

import { HealthCompositionModule } from '@infra/composition/health.composition.module';

@Module({
  imports: [HealthCompositionModule],
  exports: [HealthCompositionModule],
})
export class HealthApplicationModule {}
