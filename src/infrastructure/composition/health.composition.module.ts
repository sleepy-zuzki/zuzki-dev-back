import { Module } from '@nestjs/common';

import { DatabasePingPort } from '@application/health/ports/database-ping.port';
import { HEALTH_DATABASE_PING } from '@application/health/ports/health.tokens';
import { HealthService } from '@application/health/services/health.service';
import { HealthInfrastructureModule } from '@infra/database/typeorm/adapters/health/health.infrastructure.module';

@Module({
  imports: [HealthInfrastructureModule],
  providers: [
    {
      provide: HealthService,
      useFactory: (dbPing: DatabasePingPort) => new HealthService(dbPing),
      inject: [HEALTH_DATABASE_PING],
    },
  ],
  exports: [HealthService],
})
export class HealthCompositionModule {}
