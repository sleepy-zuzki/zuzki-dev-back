import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { FileEntity } from '@features/files/entities/file.entity';

import { BlogEntryEntity } from './blog-entry.entity';

@Entity({ name: 'files', schema: 'blog' })
export class BlogFileEntity {
  @PrimaryColumn({ name: 'blog_id', type: 'uuid' })
  blogId!: string;

  @PrimaryColumn({ name: 'file_id', type: 'uuid' })
  fileId!: string;

  @ManyToOne(() => BlogEntryEntity, (blog) => blog.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id' })
  blog!: BlogEntryEntity;

  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id' })
  file!: FileEntity;

  @Column({ name: 'file_type_id', type: 'uuid' })
  fileTypeId!: string;

  @ManyToOne(() => CatalogItemEntity)
  @JoinColumn({ name: 'file_type_id' })
  fileType!: CatalogItemEntity;

  @Column({ type: 'int', default: 1 })
  order!: number;
}
