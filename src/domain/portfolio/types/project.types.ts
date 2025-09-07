// Tipados para proyectos
export const PROJECT_CATEGORIES = [
  'front',
  'back',
  'mobile',
  'devops',
  'design',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export interface TechnologyRef {
  id: number;
  name: string;
  slug: string;
}

export interface FileRef {
  id: number;
  url: string;
  // Posición opcional dentro de un carrusel
  position?: number | null;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  year?: number | null;
  isFeatured: boolean;
  technologies: TechnologyRef[];
  previewImage?: FileRef | null;
  // Imágenes del carrusel ordenadas por position
  carouselImages?: FileRef[];
}

export interface CreateProjectInput {
  name: string;
  slug: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  year?: number | null;
  isFeatured?: boolean;
  technologyIds?: number[] | null;
  previewImageId?: number | null;
}

export interface UpdateProjectInput {
  name?: string;
  slug?: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  year?: number | null;
  isFeatured?: boolean;
  technologyIds?: number[] | null;
  previewImageId?: number | null;
}
