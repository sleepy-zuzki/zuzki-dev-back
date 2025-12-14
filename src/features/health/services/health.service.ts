import { Injectable } from '@nestjs/common';

import { DatabasePingResult } from '../dto/database-ping.types';

import { DatabasePingService } from './database-ping.service';

@Injectable()
export class HealthService {
  constructor(private readonly dbPing: DatabasePingService) {}

  async check(): Promise<{
    status: string;
    uptime: number;
    timestamp: string;
    database: DatabasePingResult;
  }> {
    const db = await this.dbPing.ping();

    return {
      status: db.status === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: db,
    };
  }
}
