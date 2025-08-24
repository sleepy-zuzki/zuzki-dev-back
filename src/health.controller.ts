import { Controller, Get, Header } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HealthController.name);
  }

  @Get()
  @Header('Cache-Control', 'no-store')
  @CacheTTL(0)
  check() {
    const payload = {
      status: 'ok' as const,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    this.logger.debug(payload, 'Healthcheck ejecutado');
    return payload;
  }
}
