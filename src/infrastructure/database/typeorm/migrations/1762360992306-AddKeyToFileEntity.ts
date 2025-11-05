import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeyToFileEntity1762360992306 implements MigrationInterface {
  name = 'AddKeyToFileEntity1762360992306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolio"."files" ADD "key" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio"."files" DROP COLUMN "key"`,
    );
  }
}
