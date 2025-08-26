import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    let dbStatus: 'up' | 'down' = 'down';
    let latencyMs: number | null = null;

    if (this.dataSource?.isInitialized) {
      const start = Date.now();
      try {
        // Consulta ligera para validar conectividad
        await this.dataSource.query('SELECT 1');
        latencyMs = Date.now() - start;
        dbStatus = 'up';
      } catch {
        dbStatus = 'down';
        latencyMs = null;
      }
    } else {
      dbStatus = 'down';
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        initialized: this.dataSource?.isInitialized ?? false,
        latencyMs,
      },
    };
  }
}
