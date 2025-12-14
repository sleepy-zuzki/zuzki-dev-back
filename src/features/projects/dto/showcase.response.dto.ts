import type { TechnologyResponseDto } from '@features/stack/dto/technology.response.dto';

export class ShowcaseResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description?: string | null;
  details?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  categoryId?: string | null;
  year?: number | null;
  isFeatured!: boolean;
  technologies?: TechnologyResponseDto[];
  createdAt!: string;
  updatedAt!: string;
}
