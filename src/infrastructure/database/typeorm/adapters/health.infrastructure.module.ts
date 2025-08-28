import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HEALTH_DATABASE_PING } from '@application/health/ports/health.tokens';
import { TypeormDatabasePingAdapter } from './health.database-ping.adapter';

@Module({
  providers: [
    {
      provide: HEALTH_DATABASE_PING,
      useFactory: (ds: DataSource) => new TypeormDatabasePingAdapter(ds),
      inject: [DataSource],
    },
  ],
  exports: [HEALTH_DATABASE_PING],
})
export class HealthInfrastructureModule {}
