import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { File, UpdateFileInput } from '../dto/file.types';
import { FileEntity } from '../entities/file.entity';
import { CloudflareR2StorageAdapter } from '@shared/storage/cloudflare-r2.storage.adapter';
import { FileToUpload } from '@shared/storage/file-storage.types';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
    private readonly storage: CloudflareR2StorageAdapter,
  ) { }

  findAll(): Promise<File[]> {
    return this.repo.find().then((files) => files.map(this.toDomain));
  }

  findOne(id: number): Promise<File | null> {
    return this.repo
      .findOne({ where: { id } })
      .then((file) => (file ? this.toDomain(file) : null));
  }

  async create(file: FileToUpload): Promise<File> {
    const uploaded = await this.storage.upload(file);
    const entity = this.repo.create({
      url: uploaded.url,
      key: uploaded.key,
      provider: uploaded.provider,
      mimeType: uploaded.fileType ?? null,
      sizeBytes: uploaded.sizeBytes ?? file.sizeBytes ?? null,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, input: UpdateFileInput): Promise<File | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    this.repo.merge(found, input);
    const saved = await this.repo.save(found);
    return this.toDomain(saved);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: FileEntity): File {
    return {
      id: entity.id,
      url: entity.url,
      key: entity.key,
      provider: entity.provider,
      mimeType: entity.mimeType ?? undefined,
      sizeBytes: entity.sizeBytes ?? undefined,
      createdAt: entity.createdAt,

    };
  }
}
