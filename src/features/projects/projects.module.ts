import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from '@features/files/files.module';
import { StackModule } from '@features/stack/stack.module';

import { ShowcasesController } from './controllers/showcases.controller';
import { ShowcaseFileEntity } from './entities/showcase-file.entity';
import { ShowcaseEntity } from './entities/showcase.entity';
import { ShowcasesService } from './services/showcases.service';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShowcaseEntity,
      ShowcaseFileEntity,
      CatalogItemEntity,
    ]),
    FilesModule,
    StackModule,
  ],
  controllers: [ShowcasesController],
  providers: [ShowcasesService],
  exports: [ShowcasesService, TypeOrmModule],
})
export class ProjectsModule {}
