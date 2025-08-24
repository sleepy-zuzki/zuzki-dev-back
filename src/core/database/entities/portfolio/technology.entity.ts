import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'technologies', schema: 'portfolio' })
export class TechnologyEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string | null;

  @ManyToOne(() => ProjectEntity, (project) => project.technologies, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  project?: ProjectEntity | null;
}
