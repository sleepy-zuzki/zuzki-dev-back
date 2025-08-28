import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCompositionModule } from '@infra/composition/health.composition.module';
import { HealthService } from '@application/health/services/health.service';

@Module({
  imports: [HealthCompositionModule],
  controllers: [HealthController],
  providers: [],
  exports: [HealthService],
})
export class HealthModule {}
