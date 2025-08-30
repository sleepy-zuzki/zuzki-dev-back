import type { Technology } from '@domain/catalog/types/technology.types';

export interface TechnologyView {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export const toTechnologyView = (t: Technology): TechnologyView => ({
  id: t.id,
  name: t.name,
  slug: t.slug,
  description: t.description ?? null,
});
