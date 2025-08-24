import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller({ path: 'metrics' })
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.metrics.contentType);
    res.send(await this.metrics.getMetricsText());
  }
}
