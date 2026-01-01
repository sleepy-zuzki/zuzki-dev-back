import type { EditorJsContent } from '@shared/types/editor-js-content.type';

import type { BlogStatus } from '../enums/blog-status.enum';

export class BlogFileResponseDto {
  id!: string;
  url!: string;
  type!: string; // 'cover', 'gallery', etc.
  order!: number;
}

export class BlogResponseDto {
  id!: string;
  status!: BlogStatus;
  title!: string;
  slug!: string;
  description?: string | null;
  content?: EditorJsContent | null;
  publishDate?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  images?: BlogFileResponseDto[];
}
