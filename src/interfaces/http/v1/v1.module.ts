import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from '@interfaces/http/v1/users/users.module';

@Module({
  imports: [CatalogModule, PortfolioModule, HealthModule, UsersModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class V1Module {}
