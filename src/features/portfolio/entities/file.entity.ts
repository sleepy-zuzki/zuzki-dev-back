import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { ProjectEntity } from './project.entity';

@Entity({ name: 'files', schema: 'portfolio' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // URL del CDN (R2, S3, etc.)
  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text', nullable: true })
  key?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string | null;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType?: string | null;

  @Column({ name: 'size_bytes', type: 'int', nullable: true })
  sizeBytes?: number | null;

  // Relación 1-1 hacia Project. Esta entidad posee la FK (project_id) y es única (1 archivo preview por proyecto).
  @OneToOne(() => ProjectEntity, (project) => project.previewImage, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project?: ProjectEntity | null;

  // Relación ManyToOne opcional para carrusel
  @ManyToOne(
    () => ProjectEntity,
    (project: ProjectEntity) => project.carouselImages,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'carousel_project_id', referencedColumnName: 'id' })
  carouselProject?: ProjectEntity | null;

  @Column({ name: 'carousel_position', type: 'int', nullable: true })
  carouselPosition?: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
