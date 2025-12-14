import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedStorageModule } from '@shared/storage/storage.module';

import { FilesController } from './controllers/files.controller';
import { FileEntity } from './entities/file.entity';
import { FilesService } from './services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), SharedStorageModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService, TypeOrmModule],
})
export class FilesModule {}
