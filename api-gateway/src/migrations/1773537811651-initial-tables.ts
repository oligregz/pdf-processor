import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTables1773537811651 implements MigrationInterface {
  name = 'InitialTables1773537811651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."process_history_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "process_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "correlation_id" character varying NOT NULL, "file_name" character varying NOT NULL, "status" "public"."process_history_status_enum" NOT NULL DEFAULT 'PENDING', "processing_start" TIMESTAMP WITH TIME ZONE, "processing_end" TIMESTAMP WITH TIME ZONE, "txt_conversion_start" TIMESTAMP WITH TIME ZONE, "txt_conversion_end" TIMESTAMP WITH TIME ZONE, "email_sent_at" TIMESTAMP WITH TIME ZONE, "file_deletion_time" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_f914ad05b6eaa3cfee703ce38ba" UNIQUE ("correlation_id"), CONSTRAINT "PK_d5f2b2f5afc55f28d38e178239b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "queue_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "position_in_queue" integer, "entered_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "process_id" uuid, CONSTRAINT "PK_b1dc9e6909dfa47158992980b48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_history" ADD CONSTRAINT "FK_ea121e9749e4ccfdc19aa95ffaf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "queue_state" ADD CONSTRAINT "FK_9cf2e8bef4a4cea13c30bd8fd72" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "queue_state" ADD CONSTRAINT "FK_cdaca42af06536c55ba189eddb8" FOREIGN KEY ("process_id") REFERENCES "process_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "queue_state" DROP CONSTRAINT "FK_cdaca42af06536c55ba189eddb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "queue_state" DROP CONSTRAINT "FK_9cf2e8bef4a4cea13c30bd8fd72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_history" DROP CONSTRAINT "FK_ea121e9749e4ccfdc19aa95ffaf"`,
    );
    await queryRunner.query(`DROP TABLE "queue_state"`);
    await queryRunner.query(`DROP TABLE "process_history"`);
    await queryRunner.query(`DROP TYPE "public"."process_history_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
