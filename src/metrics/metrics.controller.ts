import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Res, Header } from '@nestjs/common';

import { MetricsService } from './metrics.service';

import type { Response } from 'express';

@Controller({ path: 'metrics' })
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @CacheTTL(0)
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.metrics.contentType);
    res.send(await this.metrics.getMetricsText());
  }
}
