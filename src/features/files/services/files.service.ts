import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CloudflareR2StorageAdapter } from '@shared/storage/cloudflare-r2.storage.adapter';
import { FileToUpload } from '@shared/storage/file-storage.types';

import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
    private readonly storage: CloudflareR2StorageAdapter,
  ) {}

  findAll(): Promise<FileEntity[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<FileEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(file: FileToUpload): Promise<FileEntity> {
    const uploaded = await this.storage.upload(file);
    const entity = this.repo.create({
      url: uploaded.url,
      key: uploaded.key,
      provider: uploaded.provider,
      mimeType: uploaded.fileType ?? null,
      sizeBytes: uploaded.sizeBytes ?? file.sizeBytes ?? null,
    });
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<boolean> {
    const found = await this.repo.findOne({ where: { id } });
    if (found && found.key) {
      // Intenta borrar de S3, si falla no bloquea (o debería loguear)
      try {
        await this.storage.delete(found.key);
      } catch (e) {
        console.error('Error deleting file from storage', e);
      }
    }
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
