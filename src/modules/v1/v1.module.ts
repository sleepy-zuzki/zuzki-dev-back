import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { CatalogModule } from './catalog/catalog.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [CatalogModule, PortfolioModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class V1Module {}
