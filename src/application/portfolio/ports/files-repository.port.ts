import {
  File,
  CreateFileInput,
  UpdateFileInput,
} from '@domain/portfolio/types/file.types';

export interface FilesRepositoryPort {
  findAll(): Promise<File[]>;
  findOne(id: number): Promise<File | null>;
  create(input: CreateFileInput): Promise<File>;
  update(id: number, input: UpdateFileInput): Promise<File | null>;
  remove(id: number): Promise<boolean>;
}
