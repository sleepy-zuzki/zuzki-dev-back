import { Module } from '@nestjs/common';
import { StacksController } from './controllers/stacks.controller';
import { TechnologiesController } from './controllers/technologies.controller';
import { StacksService } from '@application/catalog/services/stacks.service';
import { TechnologiesService } from '@application/catalog/services/technologies.service';
import { CatalogCompositionModule } from '@infra/composition/catalog.composition.module';

@Module({
  imports: [CatalogCompositionModule],
  controllers: [StacksController, TechnologiesController],
  providers: [],
  exports: [StacksService, TechnologiesService],
})
export class CatalogModule {}
