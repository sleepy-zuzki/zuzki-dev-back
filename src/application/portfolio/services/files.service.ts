import { FilesRepositoryPort } from '../ports/files-repository.port';
import {
  File,
  CreateFileInput,
  UpdateFileInput,
} from '@domain/portfolio/types/file.types';

export class FilesService {
  constructor(private readonly repo: FilesRepositoryPort) {}

  findAll(): Promise<File[]> {
    return this.repo.findAll();
  }

  findOne(id: number): Promise<File | null> {
    return this.repo.findOne(id);
  }

  create(input: CreateFileInput): Promise<File> {
    return this.repo.create(input);
  }

  update(id: number, input: UpdateFileInput): Promise<File | null> {
    return this.repo.update(id, input);
  }

  remove(id: number): Promise<boolean> {
    return this.repo.remove(id);
  }
}
