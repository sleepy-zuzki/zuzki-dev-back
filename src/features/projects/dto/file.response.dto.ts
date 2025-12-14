export class FileResponseDto {
  id!: number;
  url!: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
}
