import type { File, UpdateFileInput } from '@domain/portfolio/types/file.types';

import type { FileStoragePort, FileToUpload } from '../ports/file-storage.port';
import type { FilesRepositoryPort } from '../ports/files-repository.port';

export class FilesService {
  constructor(
    private readonly repo: FilesRepositoryPort,
    private readonly storage: FileStoragePort,
  ) {}

  findAll(): Promise<File[]> {
    return this.repo.findAll();
  }

  findOne(id: number): Promise<File | null> {
    return this.repo.findOne(id);
  }

  async create(file: FileToUpload): Promise<File> {
    const uploaded = await this.storage.upload(file);
    return this.repo.create({
      url: uploaded.url,
      key: uploaded.key,
      provider: uploaded.provider,
      mimeType: uploaded.fileType ?? null,
      sizeBytes: uploaded.sizeBytes ?? file.sizeBytes ?? null,
    });
  }

  update(id: number, input: UpdateFileInput): Promise<File | null> {
    return this.repo.update(id, input);
  }

  remove(id: number): Promise<boolean> {
    return this.repo.remove(id);
  }
}
