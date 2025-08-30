import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectsRepositoryPort } from '@application/portfolio/ports/projects-repository.port';
import {
  CreateProjectInput,
  Project,
  TechnologyRef,
  FileRef,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';

type HasProjectRels = {
  technologies?: Array<{ id: number; name: string; slug: string }>;
  previewImage?: { id: number; url: string } | null;
};

export class ProjectsRepositoryTypeormAdapter
  implements ProjectsRepositoryPort
{
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
  ) {}

  async findAll(): Promise<Project[]> {
    const list = await this.repo.find({ order: { name: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const found = await this.repo.findOne({ where: { slug } });
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
      // technologyIds y previewImageId se resuelven en capas superiores o mediante otra lógica
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

  // ManyToMany: reemplaza completamente las tecnologías del proyecto
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

  // OneToOne (FK en FileEntity): limpia previo preview y asigna nuevo file si corresponde
  async setPreviewImage(
    projectId: number,
    fileId: number | null,
  ): Promise<void> {
    // Limpia cualquier preview actual del proyecto (si existe)
    await this.repo
      .createQueryBuilder()
      .relation(ProjectEntity, 'previewImage')
      .of(projectId)
      .set(null);

    if (fileId !== null) {
      // Asigna el archivo como preview del proyecto estableciendo la FK en FileEntity
      await this.repo
        .createQueryBuilder()
        .relation(FileEntity, 'project')
        .of(fileId)
        .set(projectId);
    }
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
    };
  }
}
