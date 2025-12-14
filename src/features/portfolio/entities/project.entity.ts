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
import { StackTechnologyEntity } from '@features/catalog/entities/technology.entity';

import { ShowcaseFileEntity } from './project-file.entity';

@Entity({ name: 'showcases', schema: 'project' })
export class ShowcaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  details?: string | null;

  @Column({ name: 'repo_url', type: 'varchar', length: 255, nullable: true })
  repoUrl?: string | null;

  @Column({ name: 'live_url', type: 'varchar', length: 255, nullable: true })
  liveUrl?: string | null;

  @Column({ name: 'category_id', nullable: true })
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
    name: 'technologies', // Table project.technologies
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
