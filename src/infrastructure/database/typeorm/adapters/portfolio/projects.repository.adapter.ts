import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectsRepositoryPort } from '@application/portfolio/ports/projects-repository.port';
import {
  CreateProjectInput,
  FileRef,
  Project,
  TechnologyRef,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';

type HasProjectRels = {
  technologies?: Array<{ id: number; name: string; slug: string }>;
  previewImage?: { id: number; url: string } | null;
  carouselImages?: Array<{
    id: number;
    url: string;
    carouselPosition?: number | null;
  }>;
};

export class ProjectsRepositoryTypeormAdapter
  implements ProjectsRepositoryPort
{
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
    @InjectRepository(FileEntity)
    private readonly filesRepo: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<Project[]> {
    const list = await this.repo.find({ order: { name: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const found = await this.repo.findOne({ where: { slug } });
    return found ? this.toDomain(found) : null;
  }

  async findBySlugWithDetails(slug: string): Promise<Project | null> {
    const found = await this.repo.findOne({
      where: { slug },
      relations: ['technologies', 'previewImage', 'carouselImages'],
      order: {
        carouselImages: {
          carouselPosition: 'ASC',
        },
      },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByIdWithDetails(id: number): Promise<Project | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['technologies', 'previewImage', 'carouselImages'],
      order: {
        carouselImages: {
          carouselPosition: 'ASC',
        },
      },
    });
    return found ? this.toDomain(found) : null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const entity = this.repo.create({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      repoUrl: input.repoUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      category: input.category ?? null,
      year: input.year ?? null,
      isFeatured: input.isFeatured ?? false,
    } as unknown as ProjectEntity);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, input: UpdateProjectInput): Promise<Project | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;

    Object.assign(found, {
      name: input.name ?? found.name,
      slug: input.slug ?? found.slug,
      description: input.description ?? found.description,
      repoUrl: input.repoUrl ?? found.repoUrl,
      liveUrl: input.liveUrl ?? found.liveUrl,
      category: input.category ?? found.category,
      year: input.year ?? found.year,
      isFeatured:
        typeof input.isFeatured === 'boolean'
          ? input.isFeatured
          : found.isFeatured,
    });

    const saved = await this.repo.save(found);
    return this.toDomain(saved);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async setTechnologies(
    projectId: number,
    technologyIds: number[],
  ): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .relation(ProjectEntity, 'technologies')
      .of(projectId)
      .set(technologyIds);
  }

  async setPreviewImage(
    projectId: number,
    fileId: number | null,
  ): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .relation(ProjectEntity, 'previewImage')
      .of(projectId)
      .set(null);

    if (fileId !== null) {
      await this.repo
        .createQueryBuilder()
        .relation(FileEntity, 'project')
        .of(fileId)
        .set(projectId);
    }
  }

  async addImageToCarousel(
    projectId: number,
    fileId: number,
    position?: number | null,
  ): Promise<void> {
    const file = await this.filesRepo.findOneBy({ id: fileId });
    if (!file) {
      // Opcional: lanzar NotFoundException si el archivo no existe
      return;
    }

    file.carouselProject = { id: projectId } as ProjectEntity;
    file.carouselPosition = position ?? 0;
    await this.filesRepo.save(file);
  }

  async removeImageFromCarousel(
    projectId: number,
    fileId: number,
  ): Promise<void> {
    const file = await this.filesRepo.findOne({
      where: { id: fileId, carouselProject: { id: projectId } },
    });

    if (file) {
      file.carouselProject = null;
      file.carouselPosition = null;
      await this.filesRepo.save(file);
    }
  }

  async updateCarouselImageOrder(
    projectId: number,
    imageOrders: Array<{ fileId: number; position: number }>,
  ): Promise<void> {
    await this.repo.manager.transaction(async (em) => {
      for (const order of imageOrders) {
        await em.update(
          FileEntity,
          { id: order.fileId, carouselProject: { id: projectId } },
          { carouselPosition: order.position },
        );
      }
    });
  }

  private toDomain(e: ProjectEntity): Project {
    const rels = e as unknown as HasProjectRels;
    const technologies: TechnologyRef[] =
      Array.isArray(rels.technologies) && rels.technologies.length
        ? rels.technologies.map((t) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
          }))
        : [];
    const previewImage: FileRef | null = rels.previewImage
      ? { id: rels.previewImage.id, url: rels.previewImage.url }
      : null;

    const carouselImages: FileRef[] =
      Array.isArray(rels.carouselImages) && rels.carouselImages.length
        ? rels.carouselImages.map((img) => ({
            id: img.id,
            url: img.url,
            position: img.carouselPosition,
          }))
        : [];

    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description ?? null,
      repoUrl: e.repoUrl ?? null,
      liveUrl: e.liveUrl ?? null,
      category: e.category ?? null,
      year: e.year ?? null,
      isFeatured: e.isFeatured ?? false,
      technologies,
      previewImage,
      carouselImages,
    };
  }
}
