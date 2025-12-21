import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogController } from './controllers/catalog.controller';
import { CatalogItemEntity } from './entities/catalog-item.entity';
import { CatalogTypeEntity } from './entities/catalog-type.entity';
import { CatalogService } from './services/catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogTypeEntity, CatalogItemEntity])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [TypeOrmModule, CatalogService],
})
export class CatalogModule {}
