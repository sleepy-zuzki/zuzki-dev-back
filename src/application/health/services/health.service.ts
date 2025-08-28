import { DatabasePingPort } from '../ports/database-ping.port';

export class HealthService {
  constructor(private readonly dbPing: DatabasePingPort) {}

  async check() {
    const db = await this.dbPing.ping();

    return {
      status: db.status === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: db,
    };
  }
}
