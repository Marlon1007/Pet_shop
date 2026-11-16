import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794835857086 implements MigrationInterface {
    name = 'InitialSchema1794835857086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "breed" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_114e1e2099cad7d73a7f0119604" UNIQUE ("name"), CONSTRAINT "PK_d1c857f060076296ce8a87b9043" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pet_status_enum" AS ENUM('Available', 'In Progress', 'Adopted')`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "age" integer NOT NULL, "gender" character varying(100) NOT NULL, "image" character varying(255), "status" "public"."pet_status_enum" NOT NULL DEFAULT 'Available', "breedId" integer, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applicant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "UQ_fbdc0939b42357f11221d81c489" UNIQUE ("email"), CONSTRAINT "PK_f4a6e907b8b17f293eb073fc5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adoption_application_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "adoption_application" ("id" SERIAL NOT NULL, "status" "public"."adoption_application_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "petId" integer, "applicantId" integer, CONSTRAINT "PK_a9f783e02276be342faeb3060fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userId" integer, CONSTRAINT "REL_83b775da14886d352de2a4cac0" UNIQUE ("userId"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_user" ("rolesId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c9667a1fe5b74f7427a3ab50025" PRIMARY KEY ("rolesId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb446d431a1abb9801e6ade445" ON "role_user"  ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a23ceb75c7511d0523c4aaf49" ON "role_user"  ("userId") `);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6" FOREIGN KEY ("breedId") REFERENCES "breed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD CONSTRAINT "FK_9385eb1967c987411d5d2a56c5a" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adoption_application" ADD CONSTRAINT "FK_ca69e7a42a61cc2d3ff33aad9a1" FOREIGN KEY ("applicantId") REFERENCES "applicant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_83b775da14886d352de2a4cac01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_user" ADD CONSTRAINT "FK_eb446d431a1abb9801e6ade4456" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_user" ADD CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_2a23ceb75c7511d0523c4aaf492"`);
        await queryRunner.query(`ALTER TABLE "role_user" DROP CONSTRAINT "FK_eb446d431a1abb9801e6ade4456"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_83b775da14886d352de2a4cac01"`);
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP CONSTRAINT "FK_ca69e7a42a61cc2d3ff33aad9a1"`);
        await queryRunner.query(`ALTER TABLE "adoption_application" DROP CONSTRAINT "FK_9385eb1967c987411d5d2a56c5a"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a23ceb75c7511d0523c4aaf49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb446d431a1abb9801e6ade445"`);
        await queryRunner.query(`DROP TABLE "role_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "adoption_application"`);
        await queryRunner.query(`DROP TYPE "public"."adoption_application_status_enum"`);
        await queryRunner.query(`DROP TABLE "applicant"`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
        await queryRunner.query(`DROP TABLE "breed"`);
    }

}
