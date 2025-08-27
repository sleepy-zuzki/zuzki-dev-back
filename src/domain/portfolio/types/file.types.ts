export interface File {
  id: number;
  url: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
}

export interface CreateFileInput {
  url: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
}

export interface UpdateFileInput {
  url?: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
}
