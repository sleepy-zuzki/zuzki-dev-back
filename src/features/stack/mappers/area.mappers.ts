import type { AreaResponseDto } from '../dto/area.response.dto';
import type { StackAreaEntity } from '../entities/area.entity';

export const toAreaView = (entity: StackAreaEntity): AreaResponseDto => ({
  id: entity.id,
  name: entity.name,
  slug: entity.slug,
  iconCode: entity.iconCode,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
});
