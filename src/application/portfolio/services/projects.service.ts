import { BadRequestException, NotFoundException } from '@nestjs/common';

import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';

import type { FilesRepositoryPort } from '../ports/files-repository.port';
import type { ProjectsRepositoryPort } from '../ports/projects-repository.port';

export class ProjectsService {
  constructor(
    private readonly projectsRepo: ProjectsRepositoryPort,
    private readonly filesRepo: FilesRepositoryPort,
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

  async create(input: CreateProjectInput): Promise<Project> {
    const { technologyIds, previewImageId, ...data } = input;

    const created = await this.projectsRepo.create({
      ...data,
    } as CreateProjectInput);

    if (technologyIds !== undefined) {
      await this.projectsRepo.setTechnologies(created.id, technologyIds ?? []);
    }
    if (previewImageId !== undefined) {
      await this.projectsRepo.setPreviewImage(
        created.id,
        previewImageId ?? null,
      );
    }
    return created;
  }

  async update(id: number, input: UpdateProjectInput): Promise<Project | null> {
    const { technologyIds, previewImageId, ...data } = input;

    const updated = await this.projectsRepo.update(id, data);
    if (!updated) return null;

    if (technologyIds !== undefined) {
      await this.projectsRepo.setTechnologies(id, technologyIds ?? []);
    }
    if (previewImageId !== undefined) {
      await this.projectsRepo.setPreviewImage(id, previewImageId ?? null);
    }
    return updated;
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
