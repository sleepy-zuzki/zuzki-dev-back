import type { Project } from '@domain/portfolio/types/project.types';

import { toFileView } from './file.mappers';

import type { FileView } from './file.mappers';

export interface ProjectView {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  year?: number | null;
  isFeatured: boolean;
  technologies: { id: number; name: string; slug: string }[];
  previewImage?: { id: number; url: string } | null;
  carouselImages?: FileView[];
}

export const toProjectView = (p: Project): ProjectView => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description ?? null,
  repoUrl: p.repoUrl ?? null,
  liveUrl: p.liveUrl ?? null,
  category: p.category ?? null,
  year: p.year ?? null,
  isFeatured: p.isFeatured,
  technologies: p.technologies.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
  })),
  previewImage: p.previewImage
    ? { id: p.previewImage.id, url: p.previewImage.url }
    : null,
  carouselImages: p.carouselImages?.map(toFileView) ?? [],
});
