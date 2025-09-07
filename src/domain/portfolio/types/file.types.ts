export interface File {
  id: number;
  url: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  // projectId: relación 1-1 usada para la imagen de preview
  projectId?: number | null;
  // carousel: relación opcional 1-N y orden dentro del carrusel
  carouselProjectId?: number | null;
  carouselPosition?: number | null;
}

export interface CreateFileInput {
  url: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
  carouselProjectId?: number | null;
  carouselPosition?: number | null;
}

export interface UpdateFileInput {
  url?: string;
  provider?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  projectId?: number | null;
  carouselProjectId?: number | null;
  carouselPosition?: number | null;
}
