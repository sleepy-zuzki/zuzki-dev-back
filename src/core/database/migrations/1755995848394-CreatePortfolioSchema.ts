import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfolioSchema1755995848394 implements MigrationInterface {
  name = 'CreatePortfolioSchema1755995848394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portfolio"."files" ("id" SERIAL NOT NULL, "url" text NOT NULL, "provider" character varying(50), "mime_type" character varying(100), "size_bytes" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "project_id" integer, CONSTRAINT "REL_b3c17c323fdc479a109e517f13" UNIQUE ("project_id"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio"."projects" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "slug" character varying(160) NOT NULL, "description" text, "repo_url" character varying(255), "live_url" character varying(255), "category" character varying(20), "year" integer, "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_96e045ab8b0271e5f5a91eae1ee" UNIQUE ("slug"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio"."technologies" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(120) NOT NULL, "website" character varying(255), "projectId" integer, CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e1b296cd0df9807f28db43bcab" ON "portfolio"."technologies" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "catalog"."tech_stacks" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(120) NOT NULL, "area" character varying(20) NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cf2ca6c1a1fa1d111cb6f983a69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_920fc08f4be34cca6c3fceabcc" ON "catalog"."tech_stacks" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio"."files" ADD CONSTRAINT "FK_b3c17c323fdc479a109e517f138" FOREIGN KEY ("project_id") REFERENCES "portfolio"."projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio"."technologies" ADD CONSTRAINT "FK_3de4912289605a78a8747e04cf4" FOREIGN KEY ("projectId") REFERENCES "portfolio"."projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio"."technologies" DROP CONSTRAINT "FK_3de4912289605a78a8747e04cf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio"."files" DROP CONSTRAINT "FK_b3c17c323fdc479a109e517f138"`,
    );
    await queryRunner.query(
      `DROP INDEX "catalog"."IDX_920fc08f4be34cca6c3fceabcc"`,
    );
    await queryRunner.query(`DROP TABLE "catalog"."tech_stacks"`);
    await queryRunner.query(
      `DROP INDEX "portfolio"."IDX_e1b296cd0df9807f28db43bcab"`,
    );
    await queryRunner.query(`DROP TABLE "portfolio"."technologies"`);
    await queryRunner.query(`DROP TABLE "portfolio"."projects"`);
    await queryRunner.query(`DROP TABLE "portfolio"."files"`);
  }
}
