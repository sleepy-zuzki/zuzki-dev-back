import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';
import type { StackArea } from '../../../../../domain/catalog/types/stack.types';

@Entity({ name: 'tech_stacks', schema: 'catalog' })
export class StackEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug!: string;

  // Área a la que pertenece (front, back, mobile, devops, design)
  @Column({ type: 'varchar', length: 20 })
  area!: StackArea;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
