import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectDetailsColumn1762290718656
  implements MigrationInterface
{
  name = 'AddProjectDetailsColumn1762290718656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio"."projects" ADD "details" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio"."projects" DROP COLUMN "details"`,
    );
  }
}
