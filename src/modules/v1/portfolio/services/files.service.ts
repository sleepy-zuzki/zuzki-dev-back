import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity, ProjectEntity } from '../../../../core/database/entities';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
  ) {}

  findAll(): Promise<FileEntity[]> {
    return this.repo.find({
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<FileEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async create(dto: CreateFileDto): Promise<FileEntity> {
    const entity = this.repo.create({
      url: dto.url,
      provider: dto.provider ?? null,
      mimeType: dto.mimeType ?? null,
      sizeBytes: dto.sizeBytes ?? null,
    });

    if (dto.projectId) {
      const project = await this.projectRepo.findOne({
        where: { id: dto.projectId },
      });
      entity.project = project ?? null;
    }

    const saved = await this.repo.save(entity);
    return this.findOne(saved.id) as Promise<FileEntity>;
  }

  async update(id: number, dto: UpdateFileDto): Promise<FileEntity | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!found) return null;

    if (dto.url !== undefined) found.url = dto.url;
    if (dto.provider !== undefined) found.provider = dto.provider;
    if (dto.mimeType !== undefined) found.mimeType = dto.mimeType;
    if (dto.sizeBytes !== undefined) found.sizeBytes = dto.sizeBytes;

    if (dto.projectId !== undefined) {
      if (dto.projectId === null) {
        found.project = null;
      } else {
        const project = await this.projectRepo.findOne({
          where: { id: dto.projectId },
        });
        found.project = project ?? null;
      }
    }

    const saved = await this.repo.save(found);
    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
