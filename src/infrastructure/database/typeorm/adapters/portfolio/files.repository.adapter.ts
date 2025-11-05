import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilesRepositoryPort } from '@application/portfolio/ports/files-repository.port';
import {
  CreateFileInput,
  File as DomainFile,
  UpdateFileInput,
} from '@domain/portfolio/types/file.types';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';

export class FilesRepositoryTypeormAdapter implements FilesRepositoryPort {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<DomainFile[]> {
    const list = await this.repo.find({ order: { id: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findOne(id: number): Promise<DomainFile | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async create(input: CreateFileInput): Promise<DomainFile> {
    const entity = this.repo.create({
      url: input.url,
      key: input.key ?? null,
      provider: input.provider ?? null,
      mimeType: input.mimeType ?? null,
      sizeBytes: input.sizeBytes ?? null,
      // Relaciones opcionales
      project:
        typeof input.projectId === 'number' && input.projectId !== null
          ? ({ id: input.projectId } as ProjectEntity)
          : null,
      carouselProject:
        typeof input.carouselProjectId === 'number' &&
        input.carouselProjectId !== null
          ? ({ id: input.carouselProjectId } as ProjectEntity)
          : null,
      carouselPosition: input.carouselPosition ?? null,
    } as unknown as FileEntity);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, input: UpdateFileInput): Promise<DomainFile | null> {
    const found: FileEntity | null = await this.repo.findOne({ where: { id } });
    if (!found) return null;

    Object.assign(found, {
      url: input.url ?? found.url,
      key: input.key ?? found.key,
      provider: input.provider ?? found.provider,
      mimeType: input.mimeType ?? found.mimeType,
      sizeBytes: input.sizeBytes ?? found.sizeBytes,
    });

    if (input.projectId !== undefined) {
      found.project =
        typeof input.projectId === 'number' && input.projectId !== null
          ? ({ id: input.projectId } as ProjectEntity)
          : null;
    }
    if (input.carouselProjectId !== undefined) {
      found.carouselProject =
        typeof input.carouselProjectId === 'number' &&
        input.carouselProjectId !== null
          ? ({ id: input.carouselProjectId } as ProjectEntity)
          : null;
    }
    if (input.carouselPosition !== undefined) {
      found.carouselPosition = input.carouselPosition ?? null;
    }

    const saved = await this.repo.save(found);
    return this.toDomain(saved);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateUrl(
    fileId: number,
    newUrl: string,
    newKey: string,
  ): Promise<DomainFile | null> {
    const found = await this.repo.findOne({ where: { id: fileId } });
    if (!found) return null;

    found.url = newUrl;
    found.key = newKey;

    const saved = await this.repo.save(found);
    return this.toDomain(saved);
  }

  private toDomain(e: FileEntity): DomainFile {
    return {
      id: e.id,
      url: e.url,
      key: e.key ?? null,
      provider: e.provider ?? null,
      mimeType: e.mimeType ?? null,
      sizeBytes: e.sizeBytes ?? null,
      projectId: e.project?.id ?? null,
      carouselProjectId: e.carouselProject?.id ?? null,
      carouselPosition: e.carouselPosition ?? null,
    };
  }
}
