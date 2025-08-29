import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCompositionModule } from '@infra/composition/health.composition.module';

@Module({
  imports: [HealthCompositionModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
