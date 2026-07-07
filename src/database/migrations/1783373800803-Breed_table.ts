import { MigrationInterface, QueryRunner } from "typeorm";

export class BreedTable1783373800803 implements MigrationInterface {
    name = 'BreedTable1783373800803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "breed" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "details" character varying NOT NULL, CONSTRAINT "PK_d1c857f060076296ce8a87b9043" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "breed"`);
    }

}
