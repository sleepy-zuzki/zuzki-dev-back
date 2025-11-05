import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  CreateProjectInputSchema,
  UpdateProjectInputSchema,
} from '@domain/schemas/portfolio/project.schema';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/schemas/portfolio/project.schema';

import type { FileStoragePort } from '../ports/file-storage.port';
import type { FilesRepositoryPort } from '../ports/files-repository.port';
import type { ProjectsRepositoryPort } from '../ports/projects-repository.port';

export class ProjectsService {
  constructor(
    private readonly projectsRepo: ProjectsRepositoryPort,
    private readonly filesRepo: FilesRepositoryPort,
    private readonly storage: FileStoragePort,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectsRepo.findAll();
  }

  async findFeatured(): Promise<Project[]> {
    return this.projectsRepo.findFeatured();
  }

  findBySlug(slug: string): Promise<Project | null> {
    return this.projectsRepo.findBySlugWithDetails(slug);
  }

  async create(input: CreateProjectInput): Promise<Project | null> {
    const validatedInput = CreateProjectInputSchema.parse(input);
    const created = await this.projectsRepo.create(validatedInput);
    if (!created) return null;
    return this.projectsRepo.findByIdWithDetails(created.id);
  }

  async update(id: number, input: UpdateProjectInput): Promise<Project | null> {
    const validatedInput = UpdateProjectInputSchema.parse(input);
    const updated = await this.projectsRepo.update(id, validatedInput);
    if (!updated) return null;
    return this.projectsRepo.findByIdWithDetails(id);
  }

  remove(id: number): Promise<boolean> {
    return this.projectsRepo.remove(id);
  }

  // --- Métodos del Carrusel ---

  async addImageToCarousel(
    projectId: number,
    fileId: number,
    position?: number,
  ): Promise<void> {
    const project = await this.projectsRepo.findByIdWithDetails(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const file = await this.filesRepo.findOne(fileId);
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

    const destinationKey = `public/projects/${project.slug}/carousel/${fileName}`;

    await this.storage.moveFile(file.key, destinationKey);

    const newUrl = file.url.replace(file.key, destinationKey);
    await this.filesRepo.updateUrl(fileId, newUrl, destinationKey);

    return this.projectsRepo.addImageToCarousel(projectId, fileId, position);
  }

  async removeImageFromCarousel(
    projectId: number,
    fileId: number,
  ): Promise<void> {
    // La implementación del repositorio ya valida la pertenencia de la imagen al proyecto
    return this.projectsRepo.removeImageFromCarousel(projectId, fileId);
  }

  async updateCarouselImageOrder(
    projectId: number,
    imageOrders: Array<{ fileId: number; position: number }>,
  ): Promise<void> {
    const project = await this.projectsRepo.findByIdWithDetails(projectId);
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

    return this.projectsRepo.updateCarouselImageOrder(projectId, imageOrders);
  }
}
