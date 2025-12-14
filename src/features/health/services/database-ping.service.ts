import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DatabasePingResult } from '../dto/database-ping.types';

@Injectable()
export class DatabasePingService {
  constructor(private readonly dataSource: DataSource) {}

  async ping(): Promise<DatabasePingResult> {
    if (!this.dataSource?.isInitialized) {
      return {
        status: 'down',
        initialized: this.dataSource?.isInitialized ?? false,
        latencyMs: null,
      };
    }

    const start = Date.now();
    try {
      await this.dataSource.query('SELECT 1');
      const latency = Date.now() - start;
      return {
        status: 'up',
        initialized: true,
        latencyMs: latency,
      };
    } catch {
      return {
        status: 'down',
        initialized: true,
        latencyMs: null,
      };
    }
  }
}
