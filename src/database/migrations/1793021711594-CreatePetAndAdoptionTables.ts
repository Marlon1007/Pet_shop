import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetAndAdoptionTables1793021711594 implements MigrationInterface {
    name = 'CreatePetAndAdoptionTables1793021711594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pet_status_enum" AS ENUM('Available', 'In Progress', 'Adopted')`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "gender" character varying NOT NULL, "image" character varying NOT NULL, "status" "public"."pet_status_enum" NOT NULL DEFAULT 'Available', "breedId" integer, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "UQ_fbdc0939b42357f11221d81c489" UNIQUE ("email"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adoption_application_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "adoption_application" ("id" SERIAL NOT NULL, "status" "public"."adoption_application_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "petId" integer, "applicantId" integer, CONSTRAINT "PK_a9f783e02276be342faeb3060fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "breed" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "breed" ADD CONSTRAINT "UQ_114e1e2099cad7d73a7f0119604" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6" FOREIGN KEY ("breedId") REFERENCES "breed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD CONSTRAINT "FK_9385eb1967c987411d5d2a56c5a" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD CONSTRAINT "FK_ca69e7a42a61cc2d3ff33aad9a1" FOREIGN KEY ("applicantId") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP CONSTRAINT "FK_ca69e7a42a61cc2d3ff33aad9a1"`);
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP CONSTRAINT "FK_9385eb1967c987411d5d2a56c5a"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6"`);
        await queryRunner.query(`ALTER TABLE "breed" DROP CONSTRAINT "UQ_114e1e2099cad7d73a7f0119604"`);
        await queryRunner.query(`ALTER TABLE "breed" ADD "details" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "adoption_application"`);
        await queryRunner.query(`DROP TYPE "public"."adoption_application_status_enum"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
    }

}
