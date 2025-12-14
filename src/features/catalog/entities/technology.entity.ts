import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StackAreaEntity } from './stack.entity';

@Entity({ name: 'technologies', schema: 'stack' })
export class StackTechnologyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'area_id' })
  areaId!: string;

  @ManyToOne(() => StackAreaEntity)
  @JoinColumn({ name: 'area_id' })
  area!: StackAreaEntity;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 120, unique: true })
  slug!: string;

  @Column({ name: 'website_url', length: 255, nullable: true })
  websiteUrl?: string | null;

  @Column({ name: 'docs_url', length: 255, nullable: true })
  docsUrl?: string | null;

  @Column({ name: 'icon_class', length: 50, nullable: true })
  iconClass?: string | null;

  @Column({ name: 'primary_color', length: 7, nullable: true })
  primaryColor?: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  updatedAt!: Date;
}
