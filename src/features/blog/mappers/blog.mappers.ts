import type { BlogResponseDto } from '../dto/blog-response.dto';
import type { BlogEntryEntity } from '../entities/blog-entry.entity';

export function toBlogResponse(entity: BlogEntryEntity): BlogResponseDto {
  return {
    id: entity.id,
    status: entity.status,
    title: entity.title,
    slug: entity.slug,
    description: entity.description,
    content: entity.content,
    publishDate: entity.publishDate,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    images: entity.files?.map((f) => ({
      id: f.file.id,
      url: f.file.url,
      type: f.fileType?.slug || 'unknown',
      order: f.order,
    })),
  };
}
