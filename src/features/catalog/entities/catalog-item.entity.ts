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

  @Column({ name: 'type_id' })
  typeId!: string;

  @ManyToOne(() => CatalogTypeEntity)
  @JoinColumn({ name: 'type_id' })
  type!: CatalogTypeEntity;

  @Column()
  name!: string;

  @Column()
  slug!: string;
}
