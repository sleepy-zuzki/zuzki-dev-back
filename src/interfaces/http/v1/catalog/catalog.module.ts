import { Module } from '@nestjs/common';

import { CatalogApplicationModule } from '@application/catalog/catalog.application.module';

import { StacksController } from './controllers/stacks.controller';
import { TechnologiesController } from './controllers/technologies.controller';

@Module({
  imports: [CatalogApplicationModule],
  controllers: [StacksController, TechnologiesController],
  providers: [],
  exports: [],
})
export class CatalogModule {}
