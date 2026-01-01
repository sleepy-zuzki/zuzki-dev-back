import type { TechnologyResponseDto } from '@features/stack/dto/technology.response.dto';
import type { EditorJsContent } from '@shared/types/editor-js-content.type';

import type { ShowcaseImageDto } from './showcase-image.dto';

export class ShowcaseResponseDto {
  id!: string;
  title!: string;
  slug!: string;
  description?: string | null;
  content?: EditorJsContent | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  area?: { id: string; name: string; slug: string } | null;
  year?: number | null;
  isFeatured!: boolean;
  technologies?: TechnologyResponseDto[];
  images?: ShowcaseImageDto[];
  createdAt!: string;
  updatedAt!: string;
}
