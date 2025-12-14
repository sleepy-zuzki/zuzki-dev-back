import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { StackTechnologyEntity } from '@features/stack/entities/technology.entity';
import type { EditorJsContent } from '@shared/types/editor-js-content.type';

import { ShowcaseFileEntity } from './showcase-file.entity';

@Entity({ name: 'showcases', schema: 'project' })
export class ShowcaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  content?: EditorJsContent | null;

  @Column({ name: 'repo_url', type: 'varchar', length: 255, nullable: true })
  repoUrl?: string | null;

  @Column({ name: 'live_url', type: 'varchar', length: 255, nullable: true })
  liveUrl?: string | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => CatalogItemEntity)
  @JoinColumn({ name: 'category_id' })
  category?: CatalogItemEntity | null;

  @Column({ type: 'int', nullable: true })
  year?: number | null;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @ManyToMany(() => StackTechnologyEntity)
  @JoinTable({
    name: 'showcase_technologies', // Renamed to avoid conflict and improve clarity
    schema: 'project',
    joinColumn: { name: 'showcase_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies?: StackTechnologyEntity[];

  @OneToMany(() => ShowcaseFileEntity, (projectFile) => projectFile.showcase, {
    cascade: true,
  })
  files?: ShowcaseFileEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
