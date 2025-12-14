import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'types', schema: 'catalog' })
export class CatalogTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  slug!: string;
}
