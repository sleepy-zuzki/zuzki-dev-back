import { Controller, Get } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HealthController.name);
  }

  @Get()
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
