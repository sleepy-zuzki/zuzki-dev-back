import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateProjectInputSchema,
  UpdateProjectInputSchema,
} from '../dto/project.schema';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '../dto/project.schema';

import { ProjectEntity } from '../entities/project.entity';
import { FileEntity } from '../entities/file.entity';
import { CloudflareR2StorageAdapter } from '../../shared/storage/cloudflare-r2.storage.adapter';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectsRepo: Repository<ProjectEntity>,
    @InjectRepository(FileEntity)
    private readonly filesRepo: Repository<FileEntity>,
    private readonly storage: CloudflareR2StorageAdapter,
  ) { }

  findAll(): Promise<Project[]> {
    return this.projectsRepo
      .find({
        order: { createdAt: 'DESC' }, // Changed startDate to createdAt or year? Entity has year. createdAt is safe default.
        relations: {
          previewImage: true,
          // stack: true, // Removed
          technologies: true,
          carouselImages: true,
        },
      })
      .then((list) => list.map(this.toDomain));
  }

  async findFeatured(): Promise<Project[]> {
    return this.projectsRepo
      .find({
        where: { isFeatured: true },
        order: { createdAt: 'DESC' },
        relations: {
          previewImage: true,
          // stack: true, // Removed
          technologies: true,
          carouselImages: true,
        },
      })
      .then((list) => list.map(this.toDomain));
  }

  findBySlug(slug: string): Promise<Project | null> {
    return this.projectsRepo
      .findOne({
        where: { slug },
        relations: {
          previewImage: true,
          // stack: true, // Removed
          technologies: true,
          carouselImages: true,
        },
      })
      .then((p) => (p ? this.toDomain(p) : null));
  }

  // Helper to map entity to domain
  private toDomain(e: ProjectEntity): Project {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description,
      details: e.details,
      // Map entity fields to domain fields (Repo -> repoUrl, Live -> liveUrl, Year -> year)
      // Actual entity names: repoUrl, liveUrl, year.
      // Actual domain names: repoUrl, liveUrl, year.
      repoUrl: e.repoUrl,
      liveUrl: e.liveUrl,
      category: e.category,
      year: e.year,
      isFeatured: e.isFeatured,
      technologies:
        e.technologies?.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          website: t.website ?? '',
        })) ?? [],
      previewImage: e.previewImage
        ? {
          id: e.previewImage.id,
          url: e.previewImage.url,
          // key is missing in entity type definition? No, it has key.
          // FileRef schema has id, url, position.
          // ProjectSchema's previewImage is FileRefSchema (id, url, position).
          // It does NOT have key, provider, mimeType etc.
          // So we just map id and url.
        }
        : null,
      carouselImages:
        e.carouselImages?.map((img) => ({
          id: img.id,
          url: img.url,
          position: img.carouselPosition,
        })) ?? [],
    };
  }

  async create(input: CreateProjectInput): Promise<Project | null> {
    const validatedInput = CreateProjectInputSchema.parse(input);
    // Entity creation logic
    // We need to handle relations manually if not using cascade?
    // TypeORM create handles basic props. Relations need entities or IDs.
    // Assuming input has IDs for stack/technologies.
    // The previous adapter likely handled this.
    // Simplified logic:
    const entity = this.projectsRepo.create({
      ...validatedInput,
      technologies: validatedInput.technologyIds?.map((id) => ({ id })),
      previewImage: validatedInput.previewImageId
        ? { id: validatedInput.previewImageId }
        : undefined,
    });
    const saved = await this.projectsRepo.save(entity);
    return this.findBySlug(saved.slug);
  }

  async update(id: number, input: UpdateProjectInput): Promise<Project | null> {
    const validatedInput = UpdateProjectInputSchema.parse(input);
    const existing = await this.projectsRepo.findOne({
      where: { id },
      relations: ['technologies', 'previewImage', 'stack'],
    });

    if (!existing) return null;

    // Merge doesn't always handle M2M well.
    // Manual handling for technologies if present.
    if (validatedInput.technologyIds) {
      existing.technologies = validatedInput.technologyIds.map((tid) => ({
        id: tid,
      })) as any;
    }
    // Stack removed from logic as it's not in schema/entity
    if (validatedInput.previewImageId !== undefined) {
      existing.previewImage = validatedInput.previewImageId
        ? ({ id: validatedInput.previewImageId } as any)
        : null;
    }

    this.projectsRepo.merge(existing, validatedInput);
    await this.projectsRepo.save(existing);

    return this.findBySlug(existing.slug);
  }

  remove(id: number): Promise<boolean> {
    return this.projectsRepo.delete(id).then((r) => (r.affected ?? 0) > 0);
  }

  // --- Métodos del Carrusel ---

  async addImageToCarousel(
    projectId: number,
    fileId: number,
    position?: number,
  ): Promise<void> {
    const project = await this.projectsRepo.findOne({
      where: { id: projectId },
      relations: { carouselImages: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const file = await this.filesRepo.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    if (!file.key) {
      throw new BadRequestException(
        `File with ID ${fileId} does not have a key`,
      );
    }

    const fileName = file.key.split('/').pop();
    if (!fileName) {
      throw new Error(`Could not extract file name from key ${file.key}`);
    }

    // Move in Storage
    const destinationKey = `public/projects/${project.slug}/carousel/${fileName}`;
    await this.storage.moveFile(file.key, destinationKey);

    // Update File URL
    const newUrl = file.url.replace(file.key, destinationKey);
    file.url = newUrl;
    file.key = destinationKey;
    file.carouselProject = project;
    file.carouselPosition =
      position ?? (project.carouselImages?.length ?? 0) + 1;

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
    const project = await this.projectsRepo.findOne({
      where: { id: projectId },
      relations: { carouselImages: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const existingFileIds = project.carouselImages?.map((img) => img.id) ?? [];
    const requestedFileIds = imageOrders.map((o) => o.fileId);

    if (existingFileIds.length !== requestedFileIds.length) {
      throw new BadRequestException(
        'The list of files to reorder does not match the number of images in the carousel.',
      );
    }

    for (const id of requestedFileIds) {
      if (!existingFileIds.includes(id)) {
        throw new BadRequestException(
          `File with ID ${id} is not part of the carousel for project ${projectId}.`,
        );
      }
    }

    // Update positions
    await Promise.all(
      imageOrders.map((order) =>
        this.filesRepo.update(order.fileId, {
          carouselPosition: order.position,
        }),
      ),
    );
  }
}
