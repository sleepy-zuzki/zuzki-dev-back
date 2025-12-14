import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { BlogFileEntity } from './blog-file.entity';

@Entity({ name: 'entries', schema: 'blog' })
export class BlogEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'jsonb', nullable: true })
  content?: never;

  @Column({ name: 'publish_date', type: 'timestamp', nullable: true })
  publishDate?: Date | null;

  @OneToMany(() => BlogFileEntity, (blogFile) => blogFile.blog, {
    cascade: true,
  })
  files?: BlogFileEntity[];

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date | null;
}
