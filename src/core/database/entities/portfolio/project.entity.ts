import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TechnologyEntity } from './technology.entity';
import { FileEntity } from './file.entity';

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

  @Column({ name: 'repo_url', type: 'varchar', length: 255, nullable: true })
  repoUrl?: string | null;

  @Column({ name: 'live_url', type: 'varchar', length: 255, nullable: true })
  liveUrl?: string | null;

  // Año en el que se realizó el proyecto
  @Column({ type: 'int', nullable: true })
  year?: number | null;

  // Marca si el proyecto es destacado
  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @OneToMany(() => TechnologyEntity, (tech) => tech.project, {
    cascade: ['insert', 'update'],
  })
  technologies?: TechnologyEntity[];

  // Relación 1-1 con FileEntity para la imagen de preview (la FK vive en FileEntity)
  @OneToOne(() => FileEntity, (file) => file.project, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  previewImage?: FileEntity | null;

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
