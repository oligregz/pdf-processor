import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErrorLogColumn1773555655189 implements MigrationInterface {
  name = 'AddErrorLogColumn1773555655189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_history" ADD "error_log" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_history" DROP COLUMN "error_log"`,
    );
  }
}
