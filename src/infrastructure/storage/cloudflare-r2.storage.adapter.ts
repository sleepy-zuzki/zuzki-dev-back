import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';

import {
  FileStoragePort,
  FileToUpload,
  UploadedFile,
} from 'src/application/portfolio/ports/file-storage.port';
import { CLOUDFLARE_R2_CONFIG } from 'src/infrastructure/config/configs/cloudflare-r2.config';

import type { CloudflareR2Config } from '@infra/config/types';

@Injectable()
export class CloudflareR2StorageAdapter implements FileStoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    @Inject(CLOUDFLARE_R2_CONFIG) private readonly r2Config: CloudflareR2Config,
  ) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: this.r2Config.endpoint,
      credentials: {
        accessKeyId: this.r2Config.accessKeyId,
        secretAccessKey: this.r2Config.secretAccessKey,
      },
    });
    this.bucket = this.r2Config.bucket;
  }

  async upload(file: FileToUpload): Promise<UploadedFile> {
    const safePrefix = file.pathPrefix?.replace(/^\/+|\/+$/g, '') || '';
    const rand = Math.random().toString(36).slice(2, 8);
    const keyBase = `${Date.now()}-${rand}-${file.fileName}`;
    const key = safePrefix ? `${safePrefix}/${keyBase}` : keyBase;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.body,
      ContentType: file.fileType,
      ...(typeof file.sizeBytes === 'number'
        ? { ContentLength: file.sizeBytes }
        : {}),
    } as never);

    try {
      await this.client.send(command);
    } catch (err) {
      throw new Error(`Cloudflare R2 upload failed: ${(err as Error).message}`);
    }

    const url = `${this.r2Config.publicUrl}/${key}`;

    return {
      url,
      provider: 'cloudflare-r2',
      fileName: file.fileName,
      fileType: file.fileType,
      sizeBytes: file.sizeBytes,
      key,
    };
  }
}
