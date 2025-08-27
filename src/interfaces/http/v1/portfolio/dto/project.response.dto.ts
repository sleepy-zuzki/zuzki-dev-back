export class ProjectResponseDto {
  id!: number;
  name!: string;
  slug!: string;
  description?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  year?: number | null;
  isFeatured!: boolean;
  technologies!: { id: number; name: string; slug: string }[];
  previewImage?: { id: number; url: string } | null;
}
