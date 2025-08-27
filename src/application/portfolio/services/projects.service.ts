import { ProjectsRepositoryPort } from '../ports/projects-repository.port';
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';

export class ProjectsService {
  constructor(private readonly repo: ProjectsRepositoryPort) {}

  findAll(): Promise<Project[]> {
    return this.repo.findAll();
  }

  findBySlug(slug: string): Promise<Project | null> {
    return this.repo.findBySlug(slug);
  }

  /**
   * Orquesta la creación del proyecto y el seteo de relaciones opcionales:
   * - technologyIds: si viene undefined, no toca; si viene null, limpia; si array, reemplaza.
   * - previewImageId: si viene undefined, no toca; si viene null, limpia; si number, reemplaza.
   */
  async create(input: CreateProjectInput): Promise<Project> {
    const { technologyIds, previewImageId, ...data } = input;

    const created = await this.repo.create({
      ...data,
      // Los defaults se resuelven en repo.create; no pasamos ids relacionales aquí
    } as CreateProjectInput);

    if (technologyIds !== undefined) {
      await this.repo.setTechnologies(created.id, technologyIds ?? []);
    }
    if (previewImageId !== undefined) {
      await this.repo.setPreviewImage(created.id, previewImageId ?? null);
    }
    return created;
  }

  /**
   * Orquesta la actualización del proyecto y el seteo de relaciones opcionales.
   */
  async update(id: number, input: UpdateProjectInput): Promise<Project | null> {
    const { technologyIds, previewImageId, ...data } = input;

    const updated = await this.repo.update(id, data);
    if (!updated) return null;

    if (technologyIds !== undefined) {
      await this.repo.setTechnologies(id, technologyIds ?? []);
    }
    if (previewImageId !== undefined) {
      await this.repo.setPreviewImage(id, previewImageId ?? null);
    }
    return updated;
  }

  remove(id: number): Promise<boolean> {
    return this.repo.remove(id);
  }
}
