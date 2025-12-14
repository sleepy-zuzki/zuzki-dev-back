import { Module } from '@nestjs/common';

import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { DatabasePingService } from './services/database-ping.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, DatabasePingService],
})
export class HealthModule { }
