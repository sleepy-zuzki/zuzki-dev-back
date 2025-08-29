import { Module } from '@nestjs/common';
import { StacksController } from './controllers/stacks.controller';
import { TechnologiesController } from './controllers/technologies.controller';
import { CatalogCompositionModule } from '@infra/composition/catalog.composition.module';

@Module({
  imports: [CatalogCompositionModule],
  controllers: [StacksController, TechnologiesController],
  providers: [],
  exports: [],
})
export class CatalogModule {}
