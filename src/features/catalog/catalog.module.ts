import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogItemEntity } from './entities/catalog-item.entity';
import { CatalogTypeEntity } from './entities/catalog-type.entity';

// TODO: Refactor controllers and services for new generic catalog structure
// import { StacksController } from './controllers/stacks.controller';
// import { TechnologiesController } from './controllers/technologies.controller';
// import { StacksService } from './services/stacks.service';
// import { TechnologiesService } from './services/technologies.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogTypeEntity, CatalogItemEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CatalogModule {}
