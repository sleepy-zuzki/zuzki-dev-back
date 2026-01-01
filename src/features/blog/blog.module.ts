import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { N8nModule } from '@shared/n8n/n8n.module';

import { BlogController } from './controllers/blog.controller';
import { BlogEntryEntity } from './entities/blog-entry.entity';
import { BlogFileEntity } from './entities/blog-file.entity';
import { BlogService } from './services/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntryEntity,
      BlogFileEntity,
      CatalogItemEntity,
    ]),
    N8nModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
