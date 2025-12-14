import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CatalogTypeEntity } from './catalog-type.entity';

@Entity({ name: 'items', schema: 'catalog' })
export class CatalogItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'type_id', type: 'uuid' })
  typeId!: string;

  @ManyToOne(() => CatalogTypeEntity)
  @JoinColumn({ name: 'type_id' })
  type!: CatalogTypeEntity;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  slug!: string;
}
