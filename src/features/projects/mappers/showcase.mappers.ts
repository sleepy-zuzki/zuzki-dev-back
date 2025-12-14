import { toTechnologyView } from '@features/stack/mappers/technology.mappers';

import type { ShowcaseResponseDto } from '../dto/showcase.response.dto';
import type { ShowcaseEntity } from '../entities/showcase.entity';

export const toShowcaseView = (
  entity: ShowcaseEntity,
): ShowcaseResponseDto => ({
  id: entity.id,
  title: entity.title,
  slug: entity.slug,
  description: entity.description,
  content: entity.content,
  repoUrl: entity.repoUrl,
  liveUrl: entity.liveUrl,
  categoryId: entity.categoryId,
  year: entity.year,
  isFeatured: entity.isFeatured,
  technologies: entity.technologies?.map(toTechnologyView) || [],
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});
