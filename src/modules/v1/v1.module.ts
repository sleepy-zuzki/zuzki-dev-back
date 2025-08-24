import { Module } from '@nestjs/common';
import { HelloController } from './hello/hello.controller';
import { HelloService } from './hello/hello.service';
import { HealthController } from './health/health.controller';
import { CatalogModule } from './catalog/catalog.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [CatalogModule, PortfolioModule],
  controllers: [HelloController, HealthController],
  providers: [HelloService],
  exports: [],
})
export class V1Module {}
