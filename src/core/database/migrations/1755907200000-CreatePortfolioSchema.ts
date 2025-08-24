import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePortfolioSchema1755907200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el schema si no existe
    await queryRunner.createSchema('portfolio', true);

    // Tabla: projects
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        schema: 'portfolio',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '150', isNullable: false },
          {
            name: 'slug',
            type: 'varchar',
            length: '160',
            isNullable: false,
            isUnique: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'repo_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'live_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'year', type: 'int', isNullable: true },
          {
            name: 'is_featured',
            type: 'boolean',
            isNullable: false,
            default: 'false',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Tabla: technologies
    await queryRunner.createTable(
      new Table({
        name: 'technologies',
        schema: 'portfolio',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'slug',
            type: 'varchar',
            length: '120',
            isNullable: false,
            isUnique: true,
          },
          { name: 'website', type: 'varchar', length: '255', isNullable: true },
          { name: 'project_id', type: 'int', isNullable: true },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_technologies_project',
            columnNames: ['project_id'],
            referencedTableName: 'projects',
            referencedSchema: 'portfolio',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        ],
      }),
      true,
    );

    // Tabla: files (1-1 con projects mediante FK única)
    await queryRunner.createTable(
      new Table({
        name: 'files',
        schema: 'portfolio',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'url', type: 'text', isNullable: false },
          { name: 'provider', type: 'varchar', length: '50', isNullable: true },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          { name: 'size_bytes', type: 'int', isNullable: true },
          { name: 'project_id', type: 'int', isNullable: true, isUnique: true },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_files_project',
            columnNames: ['project_id'],
            referencedTableName: 'projects',
            referencedSchema: 'portfolio',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // El orden inverso evita errores por dependencias
    await queryRunner.dropTable('portfolio.files', true);
    await queryRunner.dropTable('portfolio.technologies', true);
    await queryRunner.dropTable('portfolio.projects', true);
    // Opcional: eliminar el schema (si está vacío)
    await queryRunner.dropSchema('portfolio', true);
  }
}
