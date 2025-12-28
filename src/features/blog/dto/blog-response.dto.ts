import type { EditorJsContent } from '@shared/types/editor-js-content.type';

import type { BlogStatus } from '../enums/blog-status.enum';

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
  // Podemos añadir files más adelante si es necesario, 
  // por ahora mantenemos lo básico para los badges
}
