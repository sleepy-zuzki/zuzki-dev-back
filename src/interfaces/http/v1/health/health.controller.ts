import { Controller, Get } from '@nestjs/common';
import { HealthService } from '@application/health/services/health.service';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  async check() {
    return this.health.check();
  }
}
