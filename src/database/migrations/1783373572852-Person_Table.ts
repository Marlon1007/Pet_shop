import { MigrationInterface, QueryRunner } from "typeorm";

export class PersonTable1783373572852 implements MigrationInterface {
    name = 'PersonTable1783373572852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userId" integer, CONSTRAINT "REL_83b775da14886d352de2a4cac0" UNIQUE ("userId"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_83b775da14886d352de2a4cac01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_83b775da14886d352de2a4cac01"`);
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
