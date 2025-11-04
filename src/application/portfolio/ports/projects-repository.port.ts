import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/schemas/portfolio/project.schema';

export interface ProjectsRepositoryPort {
  findAll(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findBySlugWithDetails(slug: string): Promise<Project | null>;
  findByIdWithDetails(id: number): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project | null>;
  update(id: number, input: UpdateProjectInput): Promise<Project | null>;
  remove(id: number): Promise<boolean>;

  /**
   * Establece (reemplaza) la imagen de preview del proyecto.
   * Usa null para eliminarla.
   */
  setPreviewImage(projectId: number, fileId: number | null): Promise<void>;

  /**
   * Carousel: gestiona imágenes del carrusel del proyecto.
   */
  addImageToCarousel(
    projectId: number,
    fileId: number,
    position?: number | null,
  ): Promise<void>;

  removeImageFromCarousel(projectId: number, fileId: number): Promise<void>;

  updateCarouselImageOrder(
    projectId: number,
    imageOrders: Array<{ fileId: number; position: number }>,
  ): Promise<void>;
}
