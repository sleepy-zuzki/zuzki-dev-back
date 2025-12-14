import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { TechnologyEntity } from '@features/catalog/entities/technology.entity';

import { FileEntity } from './file.entity';

import type { ProjectCategory } from '../dto/project.schema';

@Entity({ name: 'projects', schema: 'portfolio' })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

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

  // Categoría del proyecto (front, back, mobile, devops, design)
  @Column({ type: 'varchar', length: 20, nullable: true })
  category?: ProjectCategory | null;

  // Año en el que se realizó el proyecto
  @Column({ type: 'int', nullable: true })
  year?: number | null;

  // Marca si el proyecto es destacado
  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @ManyToMany(() => TechnologyEntity, { eager: false })
  @JoinTable({
    name: 'project_technologies',
    schema: 'portfolio',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies?: TechnologyEntity[];

  // Relación 1-1 con FileEntity para la imagen de preview (la FK vive en FileEntity)
  @OneToOne(() => FileEntity, (file) => file.project, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  previewImage?: FileEntity | null;

  // Relación 1-N para imágenes de carrusel (FK y posición viven en FileEntity)
  @OneToMany(() => FileEntity, (file) => file.carouselProject, {
    cascade: ['insert', 'update'],
  })
  carouselImages?: FileEntity[];

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
