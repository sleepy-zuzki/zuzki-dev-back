import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';
import { TechnologyEntity } from '@infra/database/typeorm/entities/catalog/technology.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
    @InjectRepository(TechnologyEntity)
    private readonly techRepo: Repository<TechnologyEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
  ) {}

  findAll(): Promise<ProjectEntity[]> {
    return this.repo.find({
      relations: ['technologies', 'previewImage'],
      order: { isFeatured: 'DESC', year: 'DESC', name: 'ASC' },
    });
  }

  findBySlug(slug: string): Promise<ProjectEntity | null> {
    return this.repo.findOne({
      where: { slug },
      relations: ['technologies', 'previewImage'],
    });
  }

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      repoUrl: dto.repoUrl ?? null,
      liveUrl: dto.liveUrl ?? null,
      category: dto.category ?? null,
      year: dto.year ?? null,
      isFeatured: dto.isFeatured ?? false,
    });

    if (dto.technologyIds && dto.technologyIds.length > 0) {
      const techs = await this.techRepo.find({
        where: { id: In(dto.technologyIds) },
      });
      project.technologies = techs;
    }

    const saved = await this.repo.save(project);

    if (dto.previewImageId) {
      const file = await this.fileRepo.findOne({
        where: { id: dto.previewImageId },
      });
      if (file) {
        file.project = saved;
        await this.fileRepo.save(file);
      }
    }

    return this.repo.findOne({
      where: { id: saved.id },
      relations: ['technologies', 'previewImage'],
    }) as Promise<ProjectEntity>;
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
  ): Promise<ProjectEntity | null> {
    const project = await this.repo.findOne({
      where: { id },
      relations: ['technologies', 'previewImage'],
    });
    if (!project) return null;

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.slug !== undefined) project.slug = dto.slug;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.repoUrl !== undefined) project.repoUrl = dto.repoUrl;
    if (dto.liveUrl !== undefined) project.liveUrl = dto.liveUrl;
    if (dto.category !== undefined) project.category = dto.category;
    if (dto.year !== undefined) project.year = dto.year;
    if (dto.isFeatured !== undefined) project.isFeatured = dto.isFeatured;

    if (dto.technologyIds !== undefined) {
      if (dto.technologyIds === null || dto.technologyIds.length === 0) {
        project.technologies = [];
      } else {
        const techs = await this.techRepo.find({
          where: { id: In(dto.technologyIds) },
        });
        project.technologies = techs;
      }
    }

    const saved = await this.repo.save(project);

    if (dto.previewImageId !== undefined) {
      if (dto.previewImageId === null) {
        // Desasociar cualquier archivo previo
        if (saved.previewImage?.id) {
          const file = await this.fileRepo.findOne({
            where: { id: saved.previewImage.id },
          });
          if (file) {
            file.project = null;
            await this.fileRepo.save(file);
          }
        }
      } else {
        const file = await this.fileRepo.findOne({
          where: { id: dto.previewImageId },
        });
        if (file) {
          file.project = saved;
          await this.fileRepo.save(file);
        }
      }
    }

    return this.repo.findOne({
      where: { id: saved.id },
      relations: ['technologies', 'previewImage'],
    });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
