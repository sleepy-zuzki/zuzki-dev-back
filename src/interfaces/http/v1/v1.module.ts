import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CatalogModule } from '@features/catalog/catalog.module';
import { ContactModule } from './contact/contact.module';
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
    ContactModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class V1Module { }
