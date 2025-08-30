import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';

export interface ProjectsRepositoryPort {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: number, input: UpdateProjectInput): Promise<Project | null>;
  remove(id: number): Promise<boolean>;

  /**
   * Establece (reemplaza) el conjunto de tecnologías asociadas al proyecto.
   * Usa un array vacío para limpiar todas.
   */
  setTechnologies(projectId: number, technologyIds: number[]): Promise<void>;

  /**
   * Establece (reemplaza) la imagen de preview del proyecto.
   * Usa null para eliminarla.
   */
  setPreviewImage(projectId: number, fileId: number | null): Promise<void>;
}
