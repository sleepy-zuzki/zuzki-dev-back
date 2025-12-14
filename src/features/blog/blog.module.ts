import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogController } from './controllers/blog.controller';
import { BlogEntryEntity } from './entities/blog-entry.entity';
import { BlogFileEntity } from './entities/blog-file.entity';
import { BlogService } from './services/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntryEntity, BlogFileEntity])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
