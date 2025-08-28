import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CatalogModule, PortfolioModule, HealthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class V1Module {}
