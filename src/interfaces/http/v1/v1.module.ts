import { Module } from '@nestjs/common';

import { AuthModule } from '@features/auth/auth.module';
import { CatalogModule } from '@features/catalog/catalog.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';
import { PortfolioModule } from '@features/portfolio/portfolio.module';
import { UsersModule } from '@features/users/users.module';

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
