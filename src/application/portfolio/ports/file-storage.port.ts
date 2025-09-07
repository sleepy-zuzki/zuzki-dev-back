export type FileToUpload = {
  fileName: string;
  fileType: string;
  body: Buffer;
  sizeBytes?: number; // optional if not known by the caller
  pathPrefix?: string; // optional logical prefix/folder (e.g., "projects/123")
};

export type UploadedFile = {
  url: string;
  provider: string;
  fileName: string;
  fileType: string;
  sizeBytes?: number;
  key?: string; // storage object key
};

export const FILE_STORAGE_PORT = 'FILE_STORAGE_PORT';

export interface FileStoragePort {
  upload(file: FileToUpload): Promise<UploadedFile>;
}
