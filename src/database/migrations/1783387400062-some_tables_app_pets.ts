import { MigrationInterface, QueryRunner } from "typeorm";

export class SomeTablesAppPets1783387400062 implements MigrationInterface {
    name = 'SomeTablesAppPets1783387400062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."pet_status_enum" AS ENUM('Available', 'In Progress', 'Adopted')`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "status" "public"."pet_status_enum" NOT NULL DEFAULT 'Available'`);
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."adoption_application_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD "status" "public"."adoption_application_status_enum" NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."adoption_application_status_enum"`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD "status" character varying NOT NULL DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "status" character varying NOT NULL`);
    }

}
