import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'areas', schema: 'stack' })
export class StackAreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug!: string;

  @Column({ name: 'icon_code', type: 'varchar', length: 50, nullable: true })
  iconCode?: string;

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
