import { Module } from '@nestjs/common';

import { HealthController } from './controllers/health.controller';
import { DatabasePingService } from './services/database-ping.service';
import { HealthService } from './services/health.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, DatabasePingService],
})
export class HealthModule {}
