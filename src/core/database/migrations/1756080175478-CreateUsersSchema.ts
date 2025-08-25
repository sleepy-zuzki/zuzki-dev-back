import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersSchema1756080175478 implements MigrationInterface {
  name = 'CreateUsersSchema1756080175478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "portfolio"."refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_expires_at" ON "portfolio"."refresh_tokens" ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_user_id" ON "portfolio"."refresh_tokens" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "password_hash" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "roles" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "portfolio"."users"."roles" IS 'Lista de roles (ej. ["user","admin"])'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email" ON "portfolio"."users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio"."refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "portfolio"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolio"."refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(`DROP INDEX "portfolio"."uq_users_email"`);
    await queryRunner.query(`DROP TABLE "portfolio"."users"`);
    await queryRunner.query(
      `DROP INDEX "portfolio"."idx_refresh_tokens_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "portfolio"."idx_refresh_tokens_expires_at"`,
    );
    await queryRunner.query(`DROP TABLE "portfolio"."refresh_tokens"`);
  }
}
