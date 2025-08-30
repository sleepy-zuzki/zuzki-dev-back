import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { HealthModule } from './health/health.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CatalogModule,
    PortfolioModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class V1Module {}
