import type { ProjectCategory } from '../../../../core/models/portfolio/project.types';

export class CreateProjectDto {
  name!: string;
  slug!: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: ProjectCategory | null;
  year?: number | null;
  isFeatured?: boolean;
  technologyIds?: number[];
  previewImageId?: number | null;
}
