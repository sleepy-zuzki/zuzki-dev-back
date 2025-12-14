import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { FileEntity } from '@features/files/entities/file.entity';

import { ShowcaseEntity } from './showcase.entity';

@Entity({ name: 'files', schema: 'project' })
export class ShowcaseFileEntity {
  @PrimaryColumn({ name: 'showcase_id', type: 'uuid' })
  showcaseId!: string;

  @PrimaryColumn({ name: 'file_id', type: 'uuid' })
  fileId!: string;

  @ManyToOne(() => ShowcaseEntity, (showcase) => showcase.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showcase_id' })
  showcase!: ShowcaseEntity;

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
