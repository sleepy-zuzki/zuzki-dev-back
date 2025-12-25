import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProjectSchema1765753509600 implements MigrationInterface {
  name = 'InitProjectSchema1765753509600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "portfolio";`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "stack";`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "catalog";`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "project";`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "blog";`);
    await queryRunner.query(
      `CREATE TABLE "stack"."areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "slug" character varying(120) NOT NULL, "icon_code" character varying(50), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b7c3c95e1c6dfe264ba33bf482a" UNIQUE ("slug"), CONSTRAINT "PK_5110493f6342f34c978c084d0d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stack"."technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "area_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(120) NOT NULL, "website_url" character varying(255), "docs_url" character varying(255), "icon_class" character varying(50), "primary_color" character varying(7), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e1b296cd0df9807f28db43bcab6" UNIQUE ("slug"), CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_expires_at" ON "refresh_tokens" ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "password_hash" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "roles" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."roles" IS 'Lista de roles (ej. ["user","admin"])'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "catalog"."types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_33b81de5358589c738907c3559b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "catalog"."items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type_id" uuid NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "key" text, "provider" character varying(50), "mime_type" character varying(100), "size_bytes" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project"."files" ("showcase_id" uuid NOT NULL, "file_id" uuid NOT NULL, "file_type_id" uuid NOT NULL, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_ecf7c3570ef0c820c21f6fe12e2" PRIMARY KEY ("showcase_id", "file_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project"."showcases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "slug" character varying(160) NOT NULL, "description" text, "content" jsonb, "repo_url" character varying(255), "live_url" character varying(255), "area_id" uuid, "year" integer, "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3e6acccd227816d0ba7b603134c" UNIQUE ("slug"), CONSTRAINT "PK_c43f52b4985c165707c01badb48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog"."entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "description" text, "content" jsonb, "publish_date" TIMESTAMP, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_1264035de794b4915a498ac77c3" UNIQUE ("slug"), CONSTRAINT "PK_23d4e7e9b58d9939f113832915b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog"."files" ("blog_id" uuid NOT NULL, "file_id" uuid NOT NULL, "file_type_id" uuid NOT NULL, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_46a2ae0fb5862bc5e8203698880" PRIMARY KEY ("blog_id", "file_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project"."showcase_technologies" ("showcase_id" uuid NOT NULL, "technology_id" uuid NOT NULL, CONSTRAINT "PK_2b2680e9a40ba4a8c8e47fad36b" PRIMARY KEY ("showcase_id", "technology_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_392afe7842862249f54614938a" ON "project"."showcase_technologies" ("showcase_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3d5d7a079ff2ac4edddf5d9f1" ON "project"."showcase_technologies" ("technology_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "stack"."technologies" ADD CONSTRAINT "FK_47dc35e481147846a60c6dda9ef" FOREIGN KEY ("area_id") REFERENCES "stack"."areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "catalog"."items" ADD CONSTRAINT "FK_a05ad4121bd274e50c9d08ab867" FOREIGN KEY ("type_id") REFERENCES "catalog"."types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" ADD CONSTRAINT "FK_2d1b37303d8033a29e272ae50ab" FOREIGN KEY ("showcase_id") REFERENCES "project"."showcases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" ADD CONSTRAINT "FK_a753eb40fcc8cd925fe9c9aded4" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" ADD CONSTRAINT "FK_02e00251d97c1cae7db8e48f5cb" FOREIGN KEY ("file_type_id") REFERENCES "catalog"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."showcases" ADD CONSTRAINT "FK_showcase_area" FOREIGN KEY ("area_id") REFERENCES "stack"."areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" ADD CONSTRAINT "FK_061f71ac205216708d97c48d1e6" FOREIGN KEY ("blog_id") REFERENCES "blog"."entries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" ADD CONSTRAINT "FK_a753eb40fcc8cd925fe9c9aded4" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" ADD CONSTRAINT "FK_02e00251d97c1cae7db8e48f5cb" FOREIGN KEY ("file_type_id") REFERENCES "catalog"."items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."showcase_technologies" ADD CONSTRAINT "FK_392afe7842862249f54614938ad" FOREIGN KEY ("showcase_id") REFERENCES "project"."showcases"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."showcase_technologies" ADD CONSTRAINT "FK_c3d5d7a079ff2ac4edddf5d9f1e" FOREIGN KEY ("technology_id") REFERENCES "stack"."technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project"."showcase_technologies" DROP CONSTRAINT "FK_c3d5d7a079ff2ac4edddf5d9f1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."showcase_technologies" DROP CONSTRAINT "FK_392afe7842862249f54614938ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" DROP CONSTRAINT "FK_02e00251d97c1cae7db8e48f5cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" DROP CONSTRAINT "FK_a753eb40fcc8cd925fe9c9aded4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog"."files" DROP CONSTRAINT "FK_061f71ac205216708d97c48d1e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."showcases" DROP CONSTRAINT "FK_showcase_area"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" DROP CONSTRAINT "FK_02e00251d97c1cae7db8e48f5cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" DROP CONSTRAINT "FK_a753eb40fcc8cd925fe9c9aded4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project"."files" DROP CONSTRAINT "FK_2d1b37303d8033a29e272ae50ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "catalog"."items" DROP CONSTRAINT "FK_a05ad4121bd274e50c9d08ab867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stack"."technologies" DROP CONSTRAINT "FK_47dc35e481147846a60c6dda9ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "project"."IDX_c3d5d7a079ff2ac4edddf5d9f1"`,
    );
    await queryRunner.query(
      `DROP INDEX "project"."IDX_392afe7842862249f54614938a"`,
    );
    await queryRunner.query(`DROP TABLE "project"."showcase_technologies"`);
    await queryRunner.query(`DROP TABLE "blog"."files"`);
    await queryRunner.query(`DROP TABLE "blog"."entries"`);
    await queryRunner.query(`DROP TABLE "project"."showcases"`);
    await queryRunner.query(`DROP TABLE "project"."files"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "catalog"."items"`);
    await queryRunner.query(`DROP TABLE "catalog"."types"`);
    await queryRunner.query(`DROP INDEX "public"."uq_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."idx_refresh_tokens_user_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_refresh_tokens_expires_at"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "stack"."technologies"`);
    await queryRunner.query(`DROP TABLE "stack"."areas"`);
  }
}
