import type { TechnologyResponseDto } from '../dto/technology.response.dto';
import type { StackTechnologyEntity } from '../entities/technology.entity';

export const toTechnologyView = (
  entity: StackTechnologyEntity,
): TechnologyResponseDto => ({
  id: entity.id,
  areaId: entity.areaId,
  name: entity.name,
  slug: entity.slug,
  websiteUrl: entity.websiteUrl,
  docsUrl: entity.docsUrl,
  iconClass: entity.iconClass,
  primaryColor: entity.primaryColor,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});
