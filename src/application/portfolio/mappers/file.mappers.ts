import { File } from '@domain/portfolio/types/file.types';

export interface FileView {
  id: number;
  url: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
}

export const toFileView = (f: File): FileView => ({
  id: f.id,
  url: f.url,
  provider: f.provider ?? null,
  mimeType: f.mimeType ?? null,
  sizeBytes: f.sizeBytes ?? null,
  projectId: f.projectId ?? null,
});
